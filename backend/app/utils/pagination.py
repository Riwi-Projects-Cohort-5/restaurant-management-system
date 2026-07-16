from math import ceil


def paginate(total: int, skip: int, limit: int) -> dict:
    return {
        "total": total,
        "skip": skip,
        "limit": limit,
        "total_pages": ceil(total / limit) if limit else 1,
        "current_page": (skip // limit) + 1 if limit else 1,
    }
