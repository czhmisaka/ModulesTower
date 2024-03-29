'''
Date: 2022-10-27 14:00:42
LastEditors: CZH
LastEditTime: 2022-10-27 23:23:59
FilePath: /configforpagedemo/pythonServer/server/models/desktop.py
'''
"""
纯增删改查操作，写在model里面
"""

from common.session import BaseModel, paginator
from peewee import CharField, IntegerField
# from playhouse.shortcuts import model_to_dict, dict_to_model


class desktop(BaseModel):
    """
    桌面配置表
    """
    id = IntegerField()
    name = CharField()
    email = CharField()
    phone = IntegerField()
    username = CharField()
    avatar = CharField()
    password = CharField()

    # class Meta:
    #     table_name = 'users'

    # @classmethod
    # def single_by_id(cls, uid: int):
    #     db = User.undelete().select(User.id, User.name, User.email, User.phone, User.username, User.avatar).\
    #         where(User.id == uid)
    #     return db.first()

    # @classmethod
    # def single_by_phone(cls, phone: int = 0):
    #     db = User.select()

    #     if phone != 0:
    #         db = db.where(User.phone == phone)
    #     return db.first()
    #     # if db:
    #     #     return model_to_dict(db)

    # @classmethod
    # def fetch_all(cls, page: int = 1, page_size: int = 10):
    #     db = User.undelete().select(User.name, User.email, User.phone, User.username, User.avatar, User.created_at,
    #                                 User.deleted_at)

    #     user_list, paginate = paginator(db, page, page_size, "id desc")

    #     return user_list, paginate


