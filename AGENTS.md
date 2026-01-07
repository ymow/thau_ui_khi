# AI Agent Integration

This project uses OpenSpec for spec-driven development.

## OpenSpec Structure

- `openspec/specs/` - Current specifications (source of truth)
- `openspec/changes/` - Proposed changes and updates

## Workflow for AI Assistants

When working on this project:

1. **Before Implementation**: Always check `openspec/specs/` for current requirements
2. **Proposing Changes**: Create change documents in `openspec/changes/` with:
   - Proposal document explaining the change
   - Implementation task list
   - Spec deltas showing ADDED/MODIFIED/REMOVED requirements
3. **During Implementation**: Follow the task lists in change proposals
4. **After Implementation**: Help archive changes back to specs

## Change Proposal Format

Each change should include:
- `proposal.md` - Description of the change and rationale
- `tasks.md` - Implementation task checklist
- `spec-deltas.md` - Specific requirement changes with status markers

## Best Practices

- Keep specs clear and concise
- Mark changes explicitly (ADDED, MODIFIED, REMOVED)
- Break down implementations into manageable tasks
- Update specs after successful implementation
