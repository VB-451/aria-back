# Aria — Backend

**Aria** is a local AI assistant system built with a modular backend architecture, integrating multiple LLM roles, tool execution, and a semantic memory system.
All components — including the language models — run locally.

---

## Overview

Aria is designed as a **multi-stage AI pipeline** that can:

* Route user requests dynamically to tools or conversational logic
* Execute external functions (web search, weather, system actions, etc.)
* Maintain both short-term and long-term memory
* Retrieve semantically relevant past information using embeddings
* Generate natural responses using locally hosted LLMs
* Convert responses to speech via a TTS pipeline

---

## Architecture

The system follows a structured orchestration flow:

```
User Input
   ↓
aria-router (LLM)
   ↓
[Optional Tool Execution]
   ↓
Memory Retrieval (Embeddings)
   ↓
aria-core (LLM)
   ↓
Response
   ↓
aria-memory (LLM) → Long-term storage (if relevant)
```

### Components

* **aria-router**

  * Determines whether a tool should be used
  * Extracts relevant subjects for memory retrieval

* **Tool System**

  * Executes backend functions based on router decision
  * Returns structured data for prompt injection

* **Memory System**

  * Retrieves semantically relevant past facts using embeddings

* **aria-core**

  * Generates the final response using:

    * user input
    * tool results (if any)
    * relevant memory

* **aria-memory**

  * Evaluates interactions and decides whether to store new facts

All models are based on **llama3:8b**, configured via Ollama with different roles (no fine-tuning).

---

## Tech Stack

* **Backend:** Express.js
* **LLM Runtime:** Ollama
* **Models:** llama3:8b (role-based configurations)
* **TTS:** Piper

---

## Tool System

Aria supports a set of modular tools executed dynamically:

* **Web Search**

  * Uses DuckDuckGo
  * Parses top results for context

* **YouTube Transcript**

  * Extracts transcript from a given video link

* **Weather**

  * Current conditions
  * 7-day forecast

* **Todo Manager**

  * Add / remove / complete / list tasks
  * Stored in local JSON

* **System Execution**

  * Launches predefined apps or links
  * Restricted via whitelist

Tools are defined declaratively and executed through a centralized executor layer.

---

## Memory System

The memory system combines structured storage with semantic search.

### Storage

* JSON-based persistence
* Each memory contains:

  * `fact`
  * `subjects`

### Retrieval

* Embeddings generated for both facts and subjects
* Retrieval process:

  1. Filter memories by subject similarity (cosine similarity)
  2. Rank candidate memories
  3. Compare user input with candidate facts for relevance

### Types of Memory

* **Short-term memory**

  * Last 6 interactions (in-memory)

* **Long-term memory**

  * Persistent facts stored via embedding-based selection

---

## Core Features

* **LLM Routing System**
  Dynamically selects between tool usage and direct response generation

* **Tool Execution Layer**
  Structured execution of backend functions with prompt injection

* **Semantic Memory Retrieval**
  Context-aware memory selection using embeddings

* **Dual Memory System**
  Short-term (context window) + long-term (persistent facts)

* **TTS Integration**
  Converts responses to speech using Piper

---

## Limitations

* No response streaming (yet)
* Single active conversation
* Fully local (no remote deployment)
* Models are not fine-tuned → may occasionally hallucinate

---

## Notes

This project focuses on **system design and orchestration of LLM-based workflows**, rather than model training.
It demonstrates how multiple specialized models, tools, and memory systems can be combined into a cohesive assistant.
