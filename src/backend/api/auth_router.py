import os
import datetime
import jwt
from functools import wraps
from flask import Blueprint, request, jsonify, current_app
from werkzeug.security import generate_password_hash, check_password_hash
from src.backend.models.database import get_db, User

auth_router = Blueprint('auth', __name__)

# Basic JWT Secret - loads from JWT_SECRET_KEY in .env file
JWT_SECRET = os.environ.get('JWT_SECRET_KEY', os.environ.get('JWT_SECRET', 'super_secret_insightiq_key_2026'))

def generate_token(user_id):
    payload = {
        'exp': datetime.datetime.utcnow() + datetime.timedelta(days=7),
        'iat': datetime.datetime.utcnow(),
        'sub': user_id
    }
    return jwt.encode(payload, JWT_SECRET, algorithm='HS256')

def require_auth(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            # MVP: allow missing token with null user_id
            request.user_id = None
            return f(*args, **kwargs)

        token = auth_header.split(' ')[1]

        # Try decoding with each key in order (supports key rotation without forcing re-login)
        keys_to_try = [JWT_SECRET, 'super_secret_insightiq_key_2026']
        last_error = None
        for key in keys_to_try:
            try:
                payload = jwt.decode(token, key, algorithms=['HS256'])
                request.user_id = payload['sub']
                return f(*args, **kwargs)
            except jwt.ExpiredSignatureError:
                return jsonify({'error': 'Token has expired. Please log in again.'}), 401
            except jwt.InvalidTokenError as e:
                last_error = e
                continue  # try next key

        # All keys failed
        return jsonify({'error': 'Invalid token. Please log in again.'}), 401

    return decorated

@auth_router.route('/api/v1/auth/register', methods=['POST'])
def register():
    data = request.get_json()
    if not data or 'email' not in data or 'password' not in data or 'name' not in data:
        return jsonify({'error': 'Missing required fields'}), 400
        
    db = next(get_db())
    try:
        # Check if user exists
        existing_user = db.query(User).filter(User.email == data['email']).first()
        if existing_user:
            return jsonify({'error': 'Email already registered'}), 400
            
        hashed_pw = generate_password_hash(data['password'])
        new_user = User(
            email=data['email'],
            name=data['name'],
            password_hash=hashed_pw
        )
        db.add(new_user)
        db.commit()
        
        token = generate_token(new_user.id)
        return jsonify({
            'message': 'User created successfully',
            'token': token,
            'user': {
                'id': new_user.id,
                'email': new_user.email,
                'name': new_user.name,
                'role': new_user.role
            }
        }), 201
    except Exception as e:
        db.rollback()
        current_app.logger.error(f"Error registering user: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500
    finally:
        db.close()

@auth_router.route('/api/v1/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data or 'email' not in data or 'password' not in data:
        return jsonify({'error': 'Missing credentials'}), 400
        
    db = next(get_db())
    try:
        user = db.query(User).filter(User.email == data['email']).first()
        if not user or not check_password_hash(user.password_hash, data['password']):
            return jsonify({'error': 'Invalid email or password'}), 401
            
        token = generate_token(user.id)
        return jsonify({
            'message': 'Login successful',
            'token': token,
            'user': {
                'id': user.id,
                'email': user.email,
                'name': user.name,
                'role': user.role
            }
        }), 200
    except Exception as e:
        current_app.logger.error(f"Error logging in: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500
    finally:
        db.close()

@auth_router.route('/api/v1/auth/me', methods=['GET'])
@require_auth
def get_me():
    if not request.user_id:
        return jsonify({'error': 'Not logged in'}), 401
        
    db = next(get_db())
    try:
        user = db.query(User).filter(User.id == request.user_id).first()
        if not user:
            return jsonify({'error': 'User not found'}), 404
            
        return jsonify({
            'user': {
                'id': user.id,
                'email': user.email,
                'name': user.name,
                'role': user.role
            }
        }), 200
    except Exception as e:
        current_app.logger.error(f"Error fetching user: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500
    finally:
        db.close()
