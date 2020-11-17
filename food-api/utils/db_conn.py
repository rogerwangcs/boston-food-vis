import pymysql
from sqlalchemy import create_engine
import os
from dotenv import load_dotenv
load_dotenv()


def db_connection():
    sqlEngine = create_engine(os.getenv("DB_STRING"))
    return sqlEngine.connect()
