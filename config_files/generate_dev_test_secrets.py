from functools import partial
import os
import hashlib
import base64
import configparser
from eth_utils import keccak
from web3 import Web3

def add_val(parser, section, key, value):
    try:
        parser[section]
    except KeyError:
        parser[section] = {}

    try:
        value = value.decode()
    except AttributeError:
        pass

        parser[section][key] = str(value)

def rand_hex(hexlen=16):
    return os.urandom(hexlen).hex()

def eth_pk():
    return Web3.toHex(keccak(os.urandom(4096)))

template_path = './templates'
specific_secrets_read_path = os.path.join(template_path, 'specific_secrets_template.ini')
common_secrets_read_path = os.path.join(template_path, 'common_secrets_template.ini')

secret_dir = './secret'
if not os.path.isdir(secret_dir):
    os.mkdir(secret_dir)

specific_secrets_write_path = os.path.join(secret_dir, 'local_secrets.ini')
test_specific_secrets_write_path = os.path.join(secret_dir, 'test_secrets.ini')
common_secrets_write_path = os.path.join(secret_dir, 'common_secrets.ini')

def generate_specific_secrets(write_path):

    specific_secrets_parser = configparser.ConfigParser()
    specific_secrets_parser.read(specific_secrets_read_path)

    add_val_sp = partial(add_val, specific_secrets_parser)

    APP = 'APP'
    add_val_sp(APP, 'password_pepper', base64.b64encode(os.urandom(32)))
    add_val_sp(APP, 'secret_key', rand_hex(32))
    add_val_sp(APP, 'ecdsa_secret', rand_hex(32))
    add_val_sp(APP, 'basic_auth_username', 'interal_basic_auth')
    add_val_sp(APP, 'basic_auth_password', rand_hex())

    DATABASE = 'DATABASE'
    add_val_sp(DATABASE, 'user', 'postgres')
    add_val_sp(DATABASE, 'password', 'password')

    ETHEREUM = 'ETHEREUM'
    add_val_sp(ETHEREUM, 'master_wallet_private_key', eth_pk())
    add_val_sp(ETHEREUM, 'owner_private_key', eth_pk())
    add_val_sp(ETHEREUM, 'float_private_key', eth_pk())

    add_val_sp('SLACK', 'HOST', '')

    GE_MIGRATION = 'GE_MIGRATION'
    add_val_sp(GE_MIGRATION, 'ge_http_provider', 'http://127.0.0.1:8500')

    with open(write_path, 'w') as f:
        specific_secrets_parser.write(f)

def generate_common_secrets(write_path):
    common_secrets_parser = configparser.ConfigParser()
    common_secrets_parser.read(common_secrets_read_path)
    with open(write_path, 'w') as f:
        common_secrets_parser.write(f)

if __name__ == '__main__':
    print('Generating deployment specific (local) secrets')
    generate_specific_secrets(specific_secrets_write_path)
    print('Generating deployment specific (test) secrets')
    generate_specific_secrets(test_specific_secrets_write_path)
    print('Generating common secrets')
    generate_common_secrets(common_secrets_write_path)
    print('Generated reasonable secrets, please modify as required')

