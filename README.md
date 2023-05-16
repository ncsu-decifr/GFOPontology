# GFOPontology

## Update ontology
### GFOP
In case of an update to the GFOP ontology, replace the _data/GFOP.owl_ file (download from webprotege as RDF/XML) and run the _gfop_to_json.py_ script. This will create a json tree of the ontology.

## microbeMASST
Download MASST results as .tsv file for all data file matches. Run the `microbe_masst_results.py` script to extract a file with all the matches to specific IDs in the metadata table. The `build_tree.py` script is then adding these results onto the tree ontology.

[Example: Yersiniabactin](https://robinschmid.github.io/GFOPontology/examples/microbeMasst_yersiniabactin.html)

### Classyfire
Download the classyfire ontology in json format. Run the _classyfire_to_json_ontology.py_ script to generate the correct format for the tree.

## Build ontology tree
Run the build_tree.py script to create a single html file that contains the javascript tree, data, and html page. 
This will:
1. Input: Ontology (json), extra data (tsv), html page with dependencies
2. Output: Merged tree data (json), self-contained html page (single file)
3. Merges extra data (e.g., MASST results) from a tsv-file (tab-separated) into an ontology tree (optional)
4. Uses base html file to internalize the tree data and all dependencies
5. Find the resulting tree data file and html file in the _dist_ folder. Default: _dist/oneindex.html_

### Mass Spectrometry Searches using MASST
https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7236533/

### Pipeline
edit bundle_to_html.py, line 83 to soup.body.append(new_script)


```
source /usr/local/pythonenvs/gfop_env/bin/activate
pip install pandas==1.5.3

cd src/
python microbe_masst_results.py -h
usage: microbe_masst_results.py [-h] [--metadata_file METADATA_FILE]
                                [--masst_file MASST_FILE] [--out_tsv_file OUT_TSV_FILE]

Merge MASST results with microbeMASST metadata

options:
  -h, --help            show this help message and exit
  --metadata_file METADATA_FILE
                        microbe masst metadata
  --masst_file MASST_FILE
                        a tab separated file with additional data that is added to
                        metadata file
  --out_tsv_file OUT_TSV_FILE
                        output file in .tsv format

python microbe_masst_results.py \
> --masst_file ../examples/yersiniabactin.tsv
     ncbi  matched_size
0     562             9
1   blank            15
2  316435            40
3  749550             1
4  749535             1
5  749527             1
6       2             2

cat dist/microbe_masst_counts.tsv
ncbi    matched_size
562     9
blank   15
316435  40
749550  1
749535  1
749527  1
2       2

python build_tree.py -h
usage: build_tree.py [-h] [--in_html IN_HTML] [--ontology ONTOLOGY] [--in_data IN_DATA]
                     [--out_html OUT_HTML] [--compress COMPRESS] [--out_tree OUT_TREE]
                     [--format FORMAT] [--node_key NODE_KEY] [--data_key DATA_KEY]

Create tree data by merging extra data into an ontology. Then create a distributable html file that
internalizes all scripts, data, etc.

options:
  -h, --help           show this help message and exit
  --in_html IN_HTML    The input html file
  --ontology ONTOLOGY  the json ontology file with children
  --in_data IN_DATA    a tab separated file with additional data that is added to the ontology
  --out_html OUT_HTML  output html file
  --compress COMPRESS  Compress output file (needs minify_html)
  --out_tree OUT_TREE  output file
  --format FORMAT      Format the json output False or True
  --node_key NODE_KEY  the field in the ontology to be compare to the field in the data file
  --data_key DATA_KEY  the field in the data file to be compared to the field in the ontology

```

