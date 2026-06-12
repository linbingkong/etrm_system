from enum import StrEnum

from pydantic import BaseModel, Field


class MenuType(StrEnum):
    DIRECTORY = "directory"
    MENU = "menu"
    BUTTON = "button"


class MenuPriority(StrEnum):
    P0 = "P0"
    P1 = "P1"
    P2 = "P2"


class MenuItem(BaseModel):
    id: str
    parent_id: str | None = None
    code: str
    title: str
    path: str
    component: str | None = None
    icon: str | None = None
    type: MenuType
    priority: MenuPriority
    sort: int
    visible: bool
    permission: str
    meta_title: str | None = None
    redirect: str | None = None
    children: list["MenuItem"] = Field(default_factory=list)


class ButtonPermission(BaseModel):
    code: str
    title: str
    page_code: str
