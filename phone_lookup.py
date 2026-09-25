#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import json
import os

class Colors:
    HEADER = '\033[95m'
    BLUE = '\033[94m'
    GREEN = '\033[92m'
    YELLOW = '\033[93m'
    RED = '\033[91m'
    RESET = '\033[0m'
    BOLD = '\033[1m'

def load_phone_data():
    if not os.path.exists('phone_data.json'):
        create_sample_data()
    
    try:
        with open('phone_data.json', 'r', encoding='utf-8') as f:
            data = json.load(f)
            return data if isinstance(data, dict) else {}
    except json.JSONDecodeError:
        print(f"{Colors.RED}⚠ خطا: فایل JSON خراب است{Colors.RESET}")
        return {}
    except Exception as e:
        print(f"{Colors.RED}⚠ خطا در خواندن فایل: {e}{Colors.RESET}")
        return {}

def create_sample_data():
    sample_data = {
        "9121234567": {"name": "علی احمدی", "city": "تهران"},
        "9351234567": {"name": "فاطمه محمودی", "city": "اصفهان"},
        "9831234567": {"name": "حسن رضایی", "city": "شیراز"},
        "9111234567": {"name": "مریم کریمی", "city": "مشهد"}
    }
    
    try:
        with open('phone_data.json', 'w', encoding='utf-8') as f:
            json.dump(sample_data, f, ensure_ascii=False, indent=2)
        print(f"{Colors.GREEN}✓ فایل نمونه ایجاد شد: phone_data.json{Colors.RESET}\n")
    except Exception as e:
        print(f"{Colors.RED}⚠ خطا در ایجاد فایل: {e}{Colors.RESET}")

def normalize_phone_number(phone):
    phone = phone.strip()
    phone = phone.replace(' ', '').replace('-', '').replace('(', '').replace(')', '')
    
    if phone.startswith('+98'):
        phone = '0' + phone[3:]
    
    if phone.startswith('0098'):
        phone = '0' + phone[4:]
    
    if phone.startswith('0'):
        phone_normalized = phone[1:]
    else:
        phone_normalized = phone
    
    return phone_normalized

def is_valid_phone(phone):
    normalized = normalize_phone_number(phone)
    
    if not normalized.isdigit() or len(normalized) != 10:
        return False
    
    if not normalized.startswith('9'):
        return False
    
    return True

def search_phone(phone_data, phone_number):
    normalized = normalize_phone_number(phone_number)
    
    if normalized in phone_data:
        return phone_data[normalized]
    
    return None

def display_header():
    print(f"\n{Colors.BOLD}{Colors.BLUE}╔═══════════════════════════════════╗{Colors.RESET}")
    print(f"{Colors.BOLD}{Colors.BLUE}║{Colors.RESET}   {Colors.BOLD}جستجوی شماره تلفن{Colors.RESET}         {Colors.BOLD}{Colors.BLUE}║{Colors.RESET}")
    print(f"{Colors.BOLD}{Colors.BLUE}╚═══════════════════════════════════╝{Colors.RESET}\n")

def display_result(result, phone):
    print(f"{Colors.GREEN}✓ پیدا شد:{Colors.RESET}")
    print(f"  نام: {result.get('name', 'نامشخص')}")
    print(f"  شهر: {result.get('city', 'نامشخص')}")
    for key, value in result.items():
        if key not in ['name', 'city']:
            print(f"  {key}: {value}")

def main():
    display_header()
    phone_data = load_phone_data()
    
    if not phone_data:
        print(f"{Colors.YELLOW}⚠ پایگاه داده خالی است{Colors.RESET}\n")
    
    print(f"{Colors.YELLOW}نحوه استفاده:{Colors.RESET}")
    print("  • شماره تلفن را وارد کنید (0912xxx... یا +98912xxx...)")
    print("  • برای خروج 'exit' تایپ کنید\n")
    
    while True:
        try:
            phone_input = input(f"{Colors.BLUE}➜ شماره تلفن: {Colors.RESET}")
            
            if phone_input.lower() == 'exit':
                print(f"{Colors.GREEN}خدانافظ!{Colors.RESET}\n")
                break
            
            if not phone_input.strip():
                print(f"{Colors.YELLOW}⚠ شماره خالی است{Colors.RESET}")
                continue
            
            if not is_valid_phone(phone_input):
                print(f"{Colors.RED}✗ شماره تلفن نامعتبر است{Colors.RESET}")
                print(f"  (شماره موبایل ایرانی باید 10 رقم باشد)")
                continue
            
            result = search_phone(phone_data, phone_input)
            
            if result:
                display_result(result, phone_input)
            else:
                print(f"{Colors.YELLOW}✗ نتیجه‌ای پیدا نشد{Colors.RESET}")
            
            print()
        
        except KeyboardInterrupt:
            print(f"\n{Colors.GREEN}خدانافظ!{Colors.RESET}\n")
            break
        except Exception as e:
            print(f"{Colors.RED}⚠ خطا: {e}{Colors.RESET}")

if __name__ == '__main__':
    main()
