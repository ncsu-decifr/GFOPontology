#!/usr/local/pythonenvs/gfop_env/bin/python


from bs4 import BeautifulSoup
import requests
import json

file = "https://external.gnps2.org/gnpslibrary"

x = requests.get(file)
print(x)



# soup = BeautifulSoup(original_html_text)

# for tag in soup.find_all('script'):
#     print("##############")
#     print(tag.text[:100])
#     print(tag.text[-100:])





