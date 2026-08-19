import { z } from 'zod';

/**
 * What a sourcing executive needs from a product photo to brief a factory.
 *
 * Opinionated on purpose. These are the fields that stop the back-and-forth
 * between a Gulf buyer and a Chinese supplier — particularly the three that
 * quietly kill deals: visible third-party branding (an IP problem), lithium
 * cells (dangerous goods, so no air freight and a different landed cost), and
 * destination-specific certification.
 */
export const productSpecSchema = z.object({
  // Identity
  productName: z
    .string()
    .describe(
      'Specific and factory-searchable. "Collapsible silicone travel kettle", not "kettle".'
    ),
  category: z.enum([
    'consumer_electronics',
    'apparel_textiles',
    'home_goods',
    'furniture',
    'industrial_components',
    'packaging',
    'other',
  ]),
  descriptionForFactory: z
    .string()
    .describe('2-3 sentences a factory rep could quote from directly.'),

  // Build
  materials: z
    .array(
      z.object({
        component: z.string().describe('e.g. body, lid, handle, lining'),
        material: z.string().describe('e.g. ABS, 304 stainless, 600D polyester'),
        confidence: z.enum(['high', 'medium', 'low']),
      })
    )
    ,
  manufacturingProcesses: z
    .array(
      z.enum([
        'injection_moulding',
        'blow_moulding',
        'die_casting',
        'cnc_machining',
        'stamping',
        'extrusion',
        'cut_and_sew',
        'assembly',
        'printing',
        'other',
      ])
    )
    ,
  keyComponents: z
    .array(z.string())
    .describe('Visible sub-assemblies that drive cost: motor, hinge, zipper, USB-C port, LED array.'),

  // Dimensions and finish
  estimatedDimensions: z.object({
    length: z.number().nullable(),
    width: z.number().nullable(),
    height: z.number().nullable(),
    unit: z.enum(['mm', 'cm']),
    basis: z
      .enum(['stated_by_customer', 'inferred_from_reference_object', 'unknown'])
      .describe('Be honest — a guessed dimension that reads as measured is worse than "unknown".'),
  }),
  colorway: z.object({
    primary: z.string(),
    secondary: z.string().nullable(),
    finish: z.enum(['matte', 'gloss', 'textured', 'metallic', 'transparent', 'mixed']),
    pantoneGuess: z.string().nullable(),
  }),

  // The three that blow up deals
  brandingVisible: z.object({
    hasLogo: z.boolean(),
    logoText: z.string().nullable(),
    note: z
      .string()
      .describe('Flag trademark/IP risk explicitly if a third-party brand is visible.'),
  }),
  powerSpec: z
    .object({
      isPowered: z.boolean(),
      batteryType: z.enum(['none', 'lithium_ion', 'lithium_polymer', 'alkaline', 'unknown']),
      voltage: z.string().nullable(),
      plugType: z.string().nullable(),
    })
    .describe('Lithium cells make this dangerous goods — restricts air freight, changes landed cost.'),
  certificationsLikelyRequired: z
    .array(
      z.enum([
        'CE', 'RoHS', 'FCC', 'UL', 'REACH', 'LFGB', 'FDA',
        'BIS', 'SASO', 'G_Mark', 'ISO9001', 'none_identified',
      ])
    )
    .describe('Weight toward destination markets: BIS for India, SASO for Saudi, G-Mark for the UAE.'),

  // Downstream
  packagingVisible: z.enum(['polybag', 'colour_box', 'blister', 'none_visible', 'other']),
  hsCodeGuess: z
    .object({
      code: z.string().nullable(),
      description: z.string().nullable(),
      confidence: z.enum(['high', 'medium', 'low']),
    })
    .describe('Drives duty, and therefore the landed-cost transparency Kaiz La promises.'),
  qcCheckpoints: z
    .array(z.string())
    .describe('Concrete pre-shipment inspection points for this specific product.'),

  // Honesty
  clarifyingQuestions: z
    .array(z.string())
    .describe(
      'What the photo genuinely cannot answer — exact dimensions, material grade, target price, ' +
        'branding. These become the open items the customer is asked to close.'
    ),
  confidence: z.enum(['high', 'medium', 'low']),
  notSourceable: z
    .object({
      flagged: z.boolean(),
      reason: z.string().nullable(),
    })
    .describe(
      'True for counterfeit or third-party branded goods, weapons, or restricted items. ' +
        'Set this honestly — a customer photographing a competitor\'s branded product is common ' +
        'and legally expensive, and it must reach a human before anyone quotes.'
    ),
});

export type ProductSpec = z.infer<typeof productSpecSchema>;

/**
 * Trim the presentational array caps AFTER parsing.
 *
 * These limits used to live in the schema as `.max()`. OpenAI treats a JSON
 * Schema `maxItems` as advisory rather than enforced, so the model would return
 * four clarifying questions and zod would reject the ENTIRE spec — throwing away
 * a complete, accurate reading over a cosmetic overrun. The guidance stays in
 * each field's description, where it belongs; the enforcement is here, where
 * exceeding it is harmless.
 */
export const SPEC_LIMITS = {
  materials: 8,
  manufacturingProcesses: 5,
  keyComponents: 10,
  qcCheckpoints: 6,
  clarifyingQuestions: 3,
} as const;

export function trimSpec(spec: ProductSpec): ProductSpec {
  return {
    ...spec,
    materials: spec.materials.slice(0, SPEC_LIMITS.materials),
    manufacturingProcesses: spec.manufacturingProcesses.slice(0, SPEC_LIMITS.manufacturingProcesses),
    keyComponents: spec.keyComponents.slice(0, SPEC_LIMITS.keyComponents),
    qcCheckpoints: spec.qcCheckpoints.slice(0, SPEC_LIMITS.qcCheckpoints),
    clarifyingQuestions: spec.clarifyingQuestions.slice(0, SPEC_LIMITS.clarifyingQuestions),
  };
}
