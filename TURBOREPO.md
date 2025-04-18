# Turborepo Configuration Update

## Syntax Change in Turborepo

In recent versions of Turborepo, there has been a significant syntax change:

- Old syntax (v1.x): Used `"pipeline"` as the main configuration key
- New syntax: Uses `"tasks"` as the main configuration key

## Current Issues

The current `turbo.json` was using the old `"pipeline"` syntax, which is causing warnings. We need to update to use the new `"tasks"` syntax to align with current Turborepo best practices.

## Correct Configuration Structure

```json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**", "build/**", ".expo/**"]
    }
    // ... other task configurations
  }
}
```

## Migration Benefits

1. Better alignment with current Turborepo versions
2. Improved clarity in task definitions
3. Consistent with modern monorepo best practices

## Next Steps

1. Update turbo.json to use the "tasks" key instead of "pipeline"
2. Verify all task configurations work as expected
3. Test the build and development workflows
