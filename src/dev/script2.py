#!/usr/local/pythonenvs/gfop_env/bin/python


from bs4 import BeautifulSoup
import requests
import json


def main():
    file = "https://external.gnps2.org/gnpslibrary"

    r = requests.get(file)
    html_text = r.text

    print(html_text)

    soup = BeautifulSoup(html_text)

    for tag in soup.find_all('script'):
        print("##############")
        print(tag.text[:100])
        print(tag.text[-100:])

    content = soup.find_all('script')[4].text
    with open("libraries.js", "w") as fp:
        fp.write(content)


if __name__ == '__main__':
    main()

