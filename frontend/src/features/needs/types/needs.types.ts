export interface NeedsArchetype {
  id: string;
  name: string;
  description?: string;
  category: string;
  source: string;
  urgencyRules: Array<{
    field: string;
    operator: string;
    value: string | number | boolean;
    setUrgency: string;
    message: string;
  }>;
  fieldSchema: Array<{
    field: string;
    label: string;
    type: string;
    required: boolean;
    options?: string[];
    defaultValue?: string | number | boolean;
  }>;
  icon?: string;
  color?: string;
}

export interface NeedsCache {
  list: NeedsArchetype[];
  map: Map<string, string>;
  loaded: boolean;
}
