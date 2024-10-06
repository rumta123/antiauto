import time

import requests
from threading import Thread
from concurrent.futures import ThreadPoolExecutor
import psycopg2

API_URL = "http://backend:3001"

test_data: list[dict] = []


def delete_test_data():
    db_param = {
        "host": "db",
        "port": 5432,
        "user": "postgres",
        "password": "postgres"
    }

    with psycopg2.connect(**db_param) as connection:
        with connection.cursor() as cursor:
            cursor.execute("""
            DELETE FROM users WHERE true;
            DELETE FROM accounts WHERE true;""")


def create_test_data(_data_num: int) -> None:
    global test_data
    test_data = [
        {
            "name": f"Name_{i}",
            "last_name": f"Last_name_{i}",
            "email": f"name_{i}@example.com",
            "phone": f"+{79347265111 + i}",
            "password": f"{_data_num + i}",
        }
        for i in range(_data_num)
    ]


def post_user(idx: int) -> None:
    global test_data
    with requests.Session() as _session:
        post_data = {
            "email": test_data[idx]["email"],
            "password": test_data[idx]["password"]
        }
        _session.post(
            url=API_URL + '/auth/sign-up',
            json=post_data,
            timeout=2,
            headers={'Content-Type': 'application/json'}
        )
        test_data[idx].setdefault("cookies", _session.cookies.get_dict())


def patch_account(idx: int) -> None:
    global test_data
    with requests.Session() as _session:
        patch_data = {
            "name": test_data[idx]["name"],
            "last_name": test_data[idx]["last_name"],
            "phone": test_data[idx]["phone"]
        }
        for key, value in test_data[idx]["cookies"].items():
            _session.cookies.set(name=key, value=value)
        _session.patch(
            url=API_URL + '/account',
            headers={'Content-Type': 'application/json'},
            json=patch_data, timeout=5
        )


def create_users_in_pool(threads_count: int, users_count: int) -> None:
    global test_data

    print(f"Creating {users_count} users in pool")
    start_total = time.time()

    with ThreadPoolExecutor(max_workers=threads_count) as executor:
        list(executor.map(post_user, range(users_count)))
    print("Create {} users in pool {} threads. Total time: {:.5}".format(
        users_count, threads_count, time.time() - start_total))

    start_patch_account = time.time()
    with ThreadPoolExecutor(max_workers=threads_count) as executor:
        list(executor.map(patch_account, range(users_count)))
    # result = future.result()
    print("Patch {} accounts in pool {} threads. Total time: {:.5}".format(
        users_count, threads_count, time.time() - start_patch_account
    ))

    print(f"Total time: {time.time() - start_total:.5f}")


def create_users(threads_count: int, users_count: int) -> None:
    global test_data

    print(f"Creating {users_count} users each in a separate thread")

    start_total = time.time()

    threads = [Thread(target=post_user, args=[i, ]) for i in range(users_count)]
    [thread.start() for thread in threads]
    [thread.join() for thread in threads]
    print("Create {} users in {} threads. Total time: {:.5f}".format(
        users_count, threads_count, time.time() - start_total))

    start_patch_account = time.time()
    threads = [Thread(target=patch_account, args=[i, ]) for i in range(users_count)]
    [thread.start() for thread in threads]
    [thread.join() for thread in threads]
    print("Patch {} accounts in {} threads. Total time: {:.5f}".format(
        users_count, threads_count, time.time() - start_patch_account))

    print(f"Total time: {time.time() - start_total:.5f}")


if __name__ == '__main__':
    data_num = 1000
    threads_num = 1000



    create_test_data(_data_num=data_num)
    for count in [1, 10, 100, 1000]:
        print("_"*70)
        delete_test_data()
        create_users(threads_count=count, users_count=count)
        delete_test_data()
        create_users_in_pool(threads_count=count, users_count=count)

    # delete_test_data()
