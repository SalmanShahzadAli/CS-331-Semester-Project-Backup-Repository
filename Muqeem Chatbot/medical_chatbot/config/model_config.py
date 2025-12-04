"""AI model configuration - Auto-detects Llama provider from your key."""

import os
from dotenv import load_dotenv

load_dotenv(override=True)

class ModelConfig:
    """Auto-config for Llama (Groq/OpenRouter/Together) - No Grok."""
    
    # API Key (loaded from .env)
    OPENROUTER_API_KEY = os.getenv('OPENROUTER_API_KEY', '')
    print(OPENROUTER_API_KEY)
    # Auto-detect and set model + base URL based on key prefix
    API_KEY = OPENROUTER_API_KEY
    if API_KEY.startswith('gsk_'):  # Groq key
        GROK_MODEL = 'llama-3.3-70b-versatile'  # Or 'llama-3.1-70b-versatile' for quality
        OPENROUTER_BASE_URL = 'https://api.groq.com/openai/v1'
    elif API_KEY.startswith('sk-or-'):  # OpenRouter key
        GROK_MODEL = 'meta-llama/llama-3.3-70b-instruct'  # Top Llama on OpenRouter
        OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1'
    elif API_KEY.startswith('ts_'):  # Together.ai key (if that's yours)
        GROK_MODEL = 'meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo'
        OPENROUTER_BASE_URL = 'https://api.together.xyz/v1'
    else:
        # Fallback to OpenRouter Llama if key doesn't match prefixes
        GROK_MODEL = 'meta-llama/llama-3.3-70b-instruct'
        OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1'
    
    # Override with .env if you set it manually
    GROK_MODEL = os.getenv('GROK_MODEL', GROK_MODEL)
    
    # Disable Grok-specific stuff (Llama doesn't need it)
    GROK_REASONING_ENABLED = os.getenv('GROK_REASONING_ENABLED', 'false').lower() == 'true'
    
    # Model parameters (same as before)
    TEMPERATURE = float(os.getenv('TEMPERATURE', '0.7'))
    MAX_TOKENS = int(os.getenv('MAX_TOKENS', '2048'))
    TOP_P = float(os.getenv('TOP_P', '0.95'))
    
    # Embeddings (unchanged, but you can ignore if not using)
    EMBEDDINGS_MODEL = os.getenv('EMBEDDINGS_MODEL', 'sentence-transformers/all-MiniLM-L6-v2')
    
    # RAG parameters (unchanged)
    CHUNK_SIZE = int(os.getenv('CHUNK_SIZE', '500'))
    CHUNK_OVERLAP = int(os.getenv('CHUNK_OVERLAP', '50'))
    TOP_K_RESULTS = int(os.getenv('TOP_K_RESULTS', '2'))
    
    # Vector database (unchanged)
    CHROMA_PERSIST_DIR = os.getenv('CHROMA_PERSIST_DIR', './chroma_db')
    
    @classmethod
    def validate_api_key(cls):
        """Check if API key is set."""
        if not cls.OPENROUTER_API_KEY or cls.OPENROUTER_API_KEY == '':
            raise ValueError(
                "API Key not found! "
                "Please set OPENROUTER_API_KEY in your .env file\n"
                "Examples:\n"
                "- Groq: Get from https://console.groq.com (starts with gsk_)\n"
                "- OpenRouter: Get from https://openrouter.ai/keys (starts with sk-or-)"
            )
        return True
    
    @classmethod
    def get_model_config(cls):
        """Get model configuration (now for Llama)."""
        cls.validate_api_key()
        return {
            'model': cls.GROK_MODEL,
            'temperature': cls.TEMPERATURE,
            'max_tokens': cls.MAX_TOKENS,
            'top_p': cls.TOP_P,
            'api_key': cls.OPENROUTER_API_KEY,
            'base_url': cls.OPENROUTER_BASE_URL,
            'reasoning_enabled': cls.GROK_REASONING_ENABLED
        }
    
    @classmethod
    def get_embeddings_config(cls):
        """Get embeddings model configuration."""
        return {
            'model_name': cls.EMBEDDINGS_MODEL,
            'model_kwargs': {'device': 'cpu'}
        }
    
    @classmethod
    def list_available_models(cls):
        """List available Llama models (based on detected provider)."""
        if cls.API_KEY.startswith('gsk_'):  # Groq
            return [
                'llama-3.3-70b-versatile',  # Best all-around
                'llama-3.1-70b-versatile',  # High quality
                'llama-3.2-3b-instruct',    # Fast & cheap
            ]
        else:  # OpenRouter/Together fallback
            return [
                'meta-llama/llama-3.3-70b-instruct',  # Top pick
                'meta-llama/llama-3.1-70b-instruct',
                'meta-llama/llama-3.2-3b-instruct',   # Fast
            ]


if __name__ == '__main__':
    print("Model Configuration (Llama - Auto-Detected):")
    print(f"  API Key: {'✅ Set' if ModelConfig.OPENROUTER_API_KEY else '❌ Not Set'}")
    print(f"  Detected Provider: {'Groq' if ModelConfig.API_KEY.startswith('gsk_') else 'OpenRouter/Together'}")
    print(f"  Llama Model: {ModelConfig.GROK_MODEL}")
    print(f"  Reasoning Enabled: {ModelConfig.GROK_REASONING_ENABLED}")
    print(f"  Temperature: {ModelConfig.TEMPERATURE}")
    print(f"  Max Tokens: {ModelConfig.MAX_TOKENS}")
    print(f"  API Base URL: {ModelConfig.OPENROUTER_BASE_URL}")
    
    print("\n  Available Llama Models:")
    for model in ModelConfig.list_available_models():
        print(f"    - {model}")
    
    try:
        ModelConfig.validate_api_key()
        print("\n✅ Configuration valid! Ready for Llama.")
    except ValueError as e:
        print(f"\n❌ Configuration error: {e}")