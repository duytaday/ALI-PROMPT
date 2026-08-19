# Initial domain model

This is a starting hypothesis, not an approved implementation schema.

## Identity and access
- User
- Role
- Session

## Prompt product
- PromptDefinition
- PromptVersion
- PromptVariable
- PromptExample
- PromptCompatibility
- PromptEvaluation
- PromptPreview

## Catalog
- Product
- ProductType
- Category
- Tag
- ProductCollection
- MerchandisingStatus

## Commerce
- Price
- Order
- Payment
- Refund
- License
- Entitlement
- EntitlementGrantAudit

## User library
- LibraryItem
- Favorite
- UserCollection
- UserPromptFork
- VariablePreset

## Optional execution domain
- Run
- ModelProvider
- ToolPermission
- RunInput
- RunOutput
- UsageCost

## Analytics
- EventDefinition
- Event
- ExperimentAssignment

## Critical invariants
- Payment processing and entitlement granting are idempotent.
- Authorization is server-enforced.
- PromptVersion is immutable after release.
- PromptPreview never contains the complete private content.
- Transactional data is not derived from analytics events.
