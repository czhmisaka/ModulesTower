'''
Date: 2022-10-23 15:32:48
LastEditors: CZH
LastEditTime: 2022-10-27 12:20:01
FilePath: /configforpagedemo/pythonServer/server/api/v1/desktop.py
'''
#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @Time    : 2020/10/16 15:21
# @Author  : CoderCharm
# @File    : endpoints.py
# @Software: PyCharm
# @Github  : github/CoderCharm
# @Desc    :
"""

"""

import os
from tkinter.tix import Tree
from typing import Any
import shutil

from tempfile import NamedTemporaryFile
from pathlib import Path

from fastapi import APIRouter, File, UploadFile, Query,Body

from schemas.response import resp
from core.config import settings
from common.sys_redis import redis_client
from models.users import User
from minio import Minio

router = APIRouter()


@router.post("/upload",name="添加或者保存桌面配置数据")
def upload(
    *,
    pathName:str=Body(...,title="桌面配置路径",embed=True),
    pageConfigData:str=Body(...,title="",embed=True)
):
    print(pathName,pageConfigData)
    return resp.ok(data={'data':'success'})