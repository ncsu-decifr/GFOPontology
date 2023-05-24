#!/usr/local/pythonenvs/gfop_env/bin/python


from bs4 import BeautifulSoup
import requests
import json
import os
import subprocess


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

def download():

    file = "libraries.json"
    home = "https://external.gnps2.org"
    with open(file) as fp:
        libraries_json = fp.read()
        libraries = json.loads(libraries_json)
        os.chdir("/usr/local/gnpslibrary")
        for library in libraries:
            if library['type'] == 'AGGREGATION':
                continue
            print(library['mgflink'])

            cmd = [
                "wget",
                "%s/%s" % (home, library['mgflink'])
            ]
            subprocess.call(cmd)

if __name__ == '__main__':
    # main()
    download()

