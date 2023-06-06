# from app import app
# from models import db, Strength, Cardio
# import pandas as pd

# df = pd.read_excel('./imports/new_try_strength_adjust.xlsx')

# with app.app_context():
#     for index, row in df.iterrows():
#         try:
#             id = row['id']
#             equipment_strength_id = row['equipment_strength_id']

#             print(f"Processing row {index}: id={id}, equipment_strength_id={equipment_strength_id}")
            
#             # Query the Strength table
#             strength_record = Strength.query.get(id)
#             print(f"Fetched strength_record: {strength_record}")

#             # Update the record
#             if strength_record:
#                 strength_record.equipment_strength_id = equipment_strength_id
#                 print(f"Updated equipment_strength_id for strength_record {id} to {strength_record.equipment_strength_id}")

#         except Exception as e:
#             print(f"Error processing row {index}: {e}")

#     try:
#         # Commit the changes after all updates are done
#         db.session.commit()
#         print("Equipment_Strengths added to Strengths")
#     except Exception as e:
#         print(f"Error committing changes: {e}")




from config import app
from models import db, Strength, Cardio

import pandas as pd

df = pd.read_excel('./imports/new_try_strength_adjust.xlsx')

with app.app_context():
    for index, row in df.iterrows():
        try:
            id = row['id']
            equipment_strength_id = row['equipment_strength_id']

            print(f"Processing row {index}: id={id}, equipment_strength_id={equipment_strength_id}")
            
            # Query the Strength table
            strength_record = Strength.query.get(id)
            print(f"Fetched strength_record: {strength_record}")

            # Update the record
            if strength_record:
                strength_record.equipment_strength_id = equipment_strength_id
                print(f"Updated equipment_strength_id for strength_record {id}")

            
            # no need to db.session.add() here as SQLAlchemy session is already tracking the changes
            db.session.commit()

        except Exception as e:
                print(f"Error processing row {index}: {e}")
    
    # Commit the changes
    # db.session.commit()
print("Equipment_Strengths added to Strengths")