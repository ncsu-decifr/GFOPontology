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
```
source /usr/local/pythonenvs/gfop_env/bin/activate
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

```

