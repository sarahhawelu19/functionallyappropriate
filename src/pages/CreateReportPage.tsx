Here's the fixed version with the missing closing brackets and characters:

```typescript
                    className="btn bg-accent-gold text-black"
                  >
                    Generate Final Report
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CreateReportPage;
```

The main issues were:

1. A missing closing `>` for a button element
2. A duplicate button block that needed to be removed
3. Missing closing brackets for the component structure

The file is now properly closed with all required brackets and elements properly terminated.