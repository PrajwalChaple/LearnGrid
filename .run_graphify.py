import sys, json
from pathlib import Path
from graphify.extract import collect_files, extract
from graphify.build import build_from_json
from graphify.cluster import cluster, score_all
from graphify.analyze import god_nodes, surprising_connections, suggest_questions
from graphify.report import generate
from graphify.export import to_json, to_html

from graphify.detect import detect

print('Starting AST extraction...')
code_files = []
detection = detect(Path('.'))
Path('graphify-out/.graphify_detect.json').write_text(json.dumps(detection, indent=2), encoding='utf-8')
for f in detection.get('files', {}).get('code', []):
    f_path = Path(f)
    if f_path.is_dir():
        code_files.extend(collect_files(f_path))
    else:
        code_files.append(f_path)

if code_files:
    ast_result = extract(code_files, cache_root=Path('.'))
    print(f"AST: {len(ast_result['nodes'])} nodes, {len(ast_result['edges'])} edges")
else:
    ast_result = {'nodes':[],'edges':[],'input_tokens':0,'output_tokens':0}
    print('No code files - skipping AST extraction')

merged = {
    'nodes': ast_result['nodes'],
    'edges': ast_result['edges'],
    'hyperedges': [],
    'input_tokens': 0,
    'output_tokens': 0,
}
Path('graphify-out/.graphify_extract.json').write_text(json.dumps(merged, indent=2), encoding="utf-8")

print('Building graph...')
G = build_from_json(merged)
if G.number_of_nodes() == 0:
    print('Graph is empty - no nodes found.')
    sys.exit(0)

communities = cluster(G)
cohesion = score_all(G, communities)
tokens = {'input': 0, 'output': 0}
gods = god_nodes(G)
surprises = surprising_connections(G, communities)

# Generate labels for communities
labels = {cid: f'Community {cid}' for cid in communities}
questions = suggest_questions(G, communities, labels)

report = generate(G, communities, cohesion, labels, gods, surprises, detection, tokens, '.', suggested_questions=questions)
Path('graphify-out/GRAPH_REPORT.md').write_text(report, encoding="utf-8")
to_json(G, communities, 'graphify-out/graph.json')
to_html(G, communities, 'graphify-out/graph.html', community_labels=labels)

analysis = {
    'communities': {str(k): v for k, v in communities.items()},
    'cohesion': {str(k): v for k, v in cohesion.items()},
    'gods': gods,
    'surprises': surprises,
    'questions': questions,
}
Path('graphify-out/.graphify_analysis.json').write_text(json.dumps(analysis, indent=2), encoding="utf-8")
print(f"Graph: {G.number_of_nodes()} nodes, {G.number_of_edges()} edges, {len(communities)} communities")
