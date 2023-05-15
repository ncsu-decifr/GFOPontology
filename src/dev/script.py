


local_file = "../dist/oneindex.html"
src_file = "../dist/oneindex_src.html"

with open(src_file) as fp:
    original_html_text = fp.read()



from bs4 import BeautifulSoup
import json


soup = BeautifulSoup(original_html_text)

for tag in soup.find_all('script'):
    print("##############")
    print(tag.text[:100])
    print(tag.text[-100:])


content = soup.find_all('script')[2].text
with open("content_src.js", "w") as fp:
    fp.write(content)


