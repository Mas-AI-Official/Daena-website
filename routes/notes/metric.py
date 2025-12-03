"""
Metric footnote endpoint for HTMX popovers
Returns JSON with metric details for footnote markers
"""

import json
from pathlib import Path

# Path to manifest
MANIFEST_PATH = Path(__file__).parent.parent.parent / "public" / "fig" / "daena" / "manifest.json"

# Metric definitions
METRICS = {
    "throughput": {
        "title": "Token Throughput",
        "description": "Measured on NatureHive NLP (v3-v7) using standard benchmark datasets. Throughput improvement of ≈2.4× compared to GPT-2 baseline, enabling faster processing of large documents and reduced latency for real-time applications.",
        "source": "Daena: The Auditable AI Vice President, page 5"
    },
    "perplexity": {
        "title": "Perplexity Reduction",
        "description": "Perplexity measured on standard language modeling benchmarks. ≈35% reduction compared to GPT-2 baseline indicates improved language modeling accuracy and better prediction of next-token probabilities, leading to more coherent outputs.",
        "source": "Daena: The Auditable AI Vice President, page 5"
    },
    "cost": {
        "title": "Cost Savings",
        "description": "Cost reduction achieved through Content-Addressable Storage (CAS) and SimHash deduplication strategies. CAS eliminates redundant storage, while SimHash enables efficient similarity detection, reducing both storage and compute costs by 60%+ in production deployments.",
        "source": "Daena: The Auditable AI Vice President, page 5"
    }
}

def get_metric(metric_id: str) -> dict:
    """
    Get metric details by ID
    
    Args:
        metric_id: Metric identifier (e.g., 'throughput', 'perplexity', 'cost')
    
    Returns:
        Dictionary with metric details or None if not found
    """
    return METRICS.get(metric_id)

def handle_request(metric_id: str) -> str:
    """
    Handle HTMX request for metric details
    
    Args:
        metric_id: Metric identifier from query parameter
    
    Returns:
        HTML string for HTMX to inject
    """
    metric = get_metric(metric_id)
    
    if not metric:
        return f'<p class="text-red-400">Metric "{metric_id}" not found.</p>'
    
    return f'''
    <div class="metric-details">
        <h4 class="font-semibold text-white mb-2">{metric["title"]}</h4>
        <p class="text-slate-300 text-sm leading-snug mb-2">{metric["description"]}</p>
        <p class="text-slate-400 text-xs italic">Source: {metric["source"]}</p>
    </div>
    '''

# For static site: This would be used with a server-side handler
# For now, we'll create a JSON endpoint that can be consumed by HTMX
if __name__ == "__main__":
    # Generate static JSON file for client-side consumption
    output_path = Path(__file__).parent.parent.parent / "public" / "metrics.json"
    with open(output_path, "w") as f:
        json.dump(METRICS, f, indent=2)
    print(f"Generated metrics.json at {output_path}")

