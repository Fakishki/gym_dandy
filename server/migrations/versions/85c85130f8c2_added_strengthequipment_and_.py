"""added StrengthEquipment and CardioEquipment classes, and adjusted Cardio and Strength classes to accommodate

Revision ID: 85c85130f8c2
Revises: 7268012376a7
Create Date: 2023-06-30 13:56:19.636043

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '85c85130f8c2'
down_revision = '7268012376a7'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('equipment_cardio',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(), nullable=True),
    sa.Column('favorite', sa.Boolean(), nullable=True),
    sa.Column('shared', sa.Boolean(), nullable=True),
    sa.Column('created_at', sa.DateTime(), server_default=sa.text('(CURRENT_TIMESTAMP)'), nullable=True),
    sa.Column('updated_at', sa.DateTime(), server_default=sa.text('(CURRENT_TIMESTAMP)'), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('equipment_strength',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(), nullable=True),
    sa.Column('favorite', sa.Boolean(), nullable=True),
    sa.Column('shared', sa.Boolean(), nullable=True),
    sa.Column('created_at', sa.DateTime(), server_default=sa.text('(CURRENT_TIMESTAMP)'), nullable=True),
    sa.Column('updated_at', sa.DateTime(), server_default=sa.text('(CURRENT_TIMESTAMP)'), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    with op.batch_alter_table('cardios', schema=None) as batch_op:
        batch_op.add_column(sa.Column('equipment_cardio_id', sa.Integer(), nullable=True))
        batch_op.create_foreign_key('fk_equipment_cardio_id', 'equipment_cardio', ['equipment_cardio_id'], ['id'])

    with op.batch_alter_table('strengths', schema=None) as batch_op:
        batch_op.add_column(sa.Column('equipment_strength_id', sa.Integer(), nullable=True))
        batch_op.create_foreign_key('fk_equipment_strength_id', 'equipment_strength', ['equipment_strength_id'], ['id'])

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('strengths', schema=None) as batch_op:
        batch_op.drop_constraint(None, type_='foreignkey')
        batch_op.drop_column('equipment_strength_id')

    with op.batch_alter_table('cardios', schema=None) as batch_op:
        batch_op.drop_constraint(None, type_='foreignkey')
        batch_op.drop_column('equipment_cardio_id')

    op.drop_table('equipment_strength')
    op.drop_table('equipment_cardio')
    # ### end Alembic commands ###
