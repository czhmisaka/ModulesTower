'''
Date: 2022-04-05 18:07:54
LastEditors: CZH
LastEditTime: 2022-04-05 23:38:56
FilePath: /configforpagedemo/pythonServer/server/core/config/development_config.py
'''


import os

from typing import Union, Optional

from pydantic import AnyHttpUrl, BaseSettings, IPvAnyAddress


class Settings(BaseSettings):
    # 开发模式配置
    DEBUG: bool = True
    # 项目文档
    TITLE: str = "FastAPI+MySQL项目生成"
    DESCRIPTION: str = "更多FastAPI知识，请关注我的个人网站 https://www.charmcode.cn/"
    # 文档地址 默认为docs 生产环境关闭 None
    DOCS_URL: str = "/api/docs"
    # 文档关联请求数据接口
    OPENAPI_URL: str = "/api/openapi.json"
    # redoc 文档
    REDOC_URL: Optional[str] = "/api/redoc"

    # token过期时间 分钟
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8

    # 生成token的加密算法
    ALGORITHM: str = "HS256"

    # 生产环境保管好 SECRET_KEY
    SECRET_KEY: str = 'webSite'

    # 项目根路径
    BASE_PATH: str = os.path.dirname(os.path.dirname(os.path.dirname((os.path.abspath(__file__)))))

    # 配置你的Mysql环境
    MYSQL_USERNAME: str = "webSite"
    MYSQL_PASSWORD: str = "WxWyhdn4at7iKmK5"
    MYSQL_HOST: str = "42.192.134.238"
    MYSQL_PORT: int = 3306
    MYSQL_DATABASE: str = 'website'

    # redis配置
    REDIS_HOST: str = "42.192.134.238"
    REDIS_PASSWORD: str = "fuckWebRedis"    
    REDIS_DB: int = 10
    REDIS_PORT: int = 6379
    REDIS_URL: str = f"redis://:{REDIS_PASSWORD}@{REDIS_HOST}:{REDIS_PORT}/{REDIS_DB}?encoding=utf-8"
    REDIS_TIMEOUT: int = 100  # redis连接超时时间

    CASBIN_MODEL_PATH: str = "./resource/rbac_model.conf"


settings = Settings()
