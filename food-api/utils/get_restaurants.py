import sys
import pandas as pd
from db_conn import db_connection


def main(args):

    # query restaurants
    queryStr = """
    USE boston_food_schema;
    SELECT * FROM brand;
    """

    df = pd.read_sql(queryStr, db_connection())
    return df.to_json()


if __name__ == "__main__":
    sys.stdout.write(main(sys.argv))
    sys.stdout.flush()
