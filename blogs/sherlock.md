# Sherlock: Bitcoin Chain Analysis Engine 🕵️‍♂️

A high-performance chain analysis engine built in Go that applies heuristics to raw Bitcoin block data to infer patterns, identify entities, and classify transaction behavior.

![Go](https://img.shields.io/badge/Go-1.24.0-blue)
![React](https://img.shields.io/badge/React-18.2.0-blue)
![Vite](https://img.shields.io/badge/Vite-5.0.8-purple)

## 🔍 Overview

Sherlock parses raw Bitcoin block files (`blk*.dat`, `rev*.dat`, `xor.dat`) entirely offline—no external APIs or nodes required. It extracts transaction data, applies probabilistic chain-analysis heuristics, and generates both machine-readable JSON and human-readable Markdown reports.

The project includes:
1. **CLI Chain Analyzer**: Applies heuristics to every transaction in a block.
2. **Web Visualizer**: An interactive UI for exploring chain analysis results and flagging suspicious transactions.
3. **Report Generator**: Automatically documents findings in Markdown.

## 🧠 Applied Heuristics

Sherlock implements multiple chain analysis heuristics to classify transactions:

- **Common Input Ownership (CIOH)**: Assumes all inputs to a transaction belong to the same entity.
- **Change Detection**: Identifies likely change outputs via script type matching, round number analysis, and output ordering.
- **Address Reuse**: Detects when the same address appears in inputs and outputs.
- **CoinJoin Detection**: Identifies privacy-enhancing CoinJoin transactions (symmetric output values, high input counts).
- **Consolidation Detection**: Flags wallet maintenance operations (many inputs -> 1-2 outputs).
- **Peeling Chain Detection**: Tracks a large input being split into a small payment and a large change output recursively.

## 🏗️ Architecture Highlights

### The Chain Analyzer CLI (`cmd/cli/main.go`)
The entry point for processing raw block data. It reads `.dat` files, invokes the analysis engine, and spits out structured JSON and Markdown reports.

```go
func main() {
	// ... Setup and arguments parsing ...

	// Parse raw block files completely offline
	parsedBlocks, err := block.ProcessBlockFiles(blkPath, revPath, xorPath)
	if err != nil {
		writeError("PARSE_ERROR", err.Error())
		os.Exit(1)
	}

	// Run chain analysis heuristics
	blkFilename := filepath.Base(blkPath)
	result := analysis.AnalyzeBlocks(parsedBlocks, blkFilename, false)
	stem := analysis.GetBlockStem(blkFilename)

	// Generate machine-readable JSON output
	jsonPath := filepath.Join("out", stem+".json")
	jsonData, err := json.MarshalIndent(result, "", "  ")
	os.WriteFile(jsonPath, jsonData, 0644)

	// Generate human-readable Markdown reports
	mdPath := filepath.Join("out", stem+".md")
	mdContent := report.GenerateMarkdownReport(result)
	os.WriteFile(mdPath, []byte(mdContent), 0644)
}
```

### The Web Visualizer API (`cmd/web/main.go`)
A lightweight Go HTTP server serving the React frontend and exposing API endpoints to query parsed block analysis results.

```go
func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "3000"
	}

	mux := http.NewServeMux()

	// API endpoints for the React visualizer
	mux.HandleFunc("/api/health", handleHealth)
	mux.HandleFunc("/api/blocks", handleListBlocks)
	mux.HandleFunc("/api/blocks/", handleGetBlock)
	mux.HandleFunc("/api/upload", handleUpload)

	// Serve static compiled SPA (React + Vite)
	webDistPath := "web/dist"
	if _, err := os.Stat(webDistPath); err == nil {
		fileServer := http.FileServer(http.Dir(webDistPath))
		mux.Handle("/", spaHandler(fileServer, webDistPath))
	}

	addr := fmt.Sprintf("127.0.0.1:%s", port)
	http.ListenAndServe(addr, withCORS(mux))
}
```

### Structured Output Schema
Sherlock aggregates massive amounts of raw hex into a clean, queryable JSON format, mapping heuristic firings to specific transaction IDs:

```json
{
  "txid": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
  "heuristics": {
    "cioh": {
      "detected": true
    },
    "change_detection": {
      "detected": true,
      "likely_change_index": 1,
      "method": "script_type_match",
      "confidence": "high"
    }
  },
  "classification": "simple_payment"
}
```
