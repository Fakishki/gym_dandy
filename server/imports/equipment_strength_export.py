from sqlalchemy import create_engine
import pandas as pd

engine = create_engine('sqlite:///../instance/app.db')  # Replace with your SQLite database path

# Query to get all data from the 'strengths' table, for example
query = 'SELECT * FROM cardios'

df = pd.read_sql_query(query, engine)

df.to_excel('equipment_cardio_export.xlsx', index=False)  # 'index=False' to exclude DataFrame indices from the output