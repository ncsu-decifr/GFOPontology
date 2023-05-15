
local_file = "src/dist/oneindex.html"
remote_file = "src/dist/oneindex_src.html"

with open(remote_file) as fp:
    original_html_text = fp.read()



from bs4 import BeautifulSoup
import json


soup = BeautifulSoup(original_html_text)

for tag in soup.find_all('script'):
    print("##############")
    print(tag.text[:100])
    print(tag.text[-100:])


content = soup.find_all('script')[2].text
with open("content_remote.js", "w") as fp:
    fp.write(content)


