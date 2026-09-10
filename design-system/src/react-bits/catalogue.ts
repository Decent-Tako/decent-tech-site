// Every React Bits component at the pinned upstream commit, by section.
//
// Source: gh api "repos/DavidHDev/react-bits/git/trees/${REACT_BITS_SHA}?recursive=1"
// filtered to src/ts-default/<Section>/<Name>/. Regenerate with
// `node scripts/vendor-react-bits.mjs --catalogue` when the pin moves.
// The Overview page marks every name here without a source.ts as planned.

export const REACT_BITS_SHA = '625f25025fed1c28e2de7d3ac5f12ee83542844d';
export const REACT_BITS_REPO = 'https://github.com/DavidHDev/react-bits';
export const REACT_BITS_SITE = 'https://reactbits.dev';
export const REACT_BITS_LICENCE = 'MIT + Commons Clause';
export const REACT_BITS_LICENCE_URL = `${REACT_BITS_REPO}/blob/${REACT_BITS_SHA}/LICENSE.md`;

export type ReactBitsSection =
  | 'Animations'
  | 'Backgrounds'
  | 'Components'
  | 'TextAnimations';

// Upstream folder name, local folder name, and the label in story titles.
export const SECTIONS: ReadonlyArray<{
  readonly section: ReactBitsSection;
  readonly folder: string;
  readonly label: string;
}> = [
  { section: 'Animations', folder: 'animations', label: 'Animations' },
  { section: 'Backgrounds', folder: 'backgrounds', label: 'Backgrounds' },
  { section: 'Components', folder: 'components', label: 'Components' },
  { section: 'TextAnimations', folder: 'text-animations', label: 'Text animations' },
];

export const CATALOGUE: Readonly<Record<ReactBitsSection, readonly string[]>> = {
  Animations: [
    'AnimatedContent',
    'Antigravity',
    'BlobCursor',
    'ClickSpark',
    'Crosshair',
    'Cubes',
    'CursorGrid',
    'ElasticMesh',
    'ElectricBorder',
    'FadeContent',
    'GhostCursor',
    'GlareHover',
    'GlowCursor',
    'GradualBlur',
    'HalftoneReveal',
    'ImageTrail',
    'LaserFlow',
    'LogoLoop',
    'MagicRings',
    'Magnet',
    'MagnetLines',
    'MetaBalls',
    'MetallicPaint',
    'Noise',
    'OrbitImages',
    'PixelSwap',
    'PixelTrail',
    'PixelTransition',
    'Ribbons',
    'RippleDistortion',
    'ScrollExpand',
    'ShapeBlur',
    'SplashCursor',
    'StarBorder',
    'StickerPeel',
    'Strands',
    'SwarmCursor',
    'TargetCursor',
  ],
  Backgrounds: [
    'AcidSquares',
    'AeroShards',
    'Aurora',
    'Balatro',
    'Ballpit',
    'Beams',
    'ColorBends',
    'CRTWarp',
    'DarkVeil',
    'Dither',
    'DotField',
    'DotGrid',
    'EvilEye',
    'FaultyTerminal',
    'Ferrofluid',
    'FloatingLines',
    'Galaxy',
    'GhostFibers',
    'GradientBlinds',
    'GradientWaves',
    'Grainient',
    'GridDistortion',
    'GridMotion',
    'GridScan',
    'Hyperspeed',
    'Iridescence',
    'LetterGlitch',
    'Lightfall',
    'Lightning',
    'LightPillar',
    'LightRays',
    'LightTunnel',
    'LineWaves',
    'LiquidChrome',
    'LiquidEther',
    'MoltenMetal',
    'Orb',
    'Particles',
    'PixelBlast',
    'PixelSnow',
    'Plasma',
    'PlasmaWave',
    'Prism',
    'PrismaticBurst',
    'Radar',
    'RippleGrid',
    'Scanner',
    'ShapeGrid',
    'SideRays',
    'Silk',
    'SlicedWaves',
    'SoftAurora',
    'Threads',
    'Topography',
    'Waves',
    'WebThreads',
  ],
  Components: [
    'AccordionGallery',
    'AnimatedList',
    'BorderGlow',
    'BounceCards',
    'BubbleMenu',
    'CardNav',
    'CardSwap',
    'Carousel',
    'ChromaGrid',
    'CircularGallery',
    'Counter',
    'CurvedInput',
    'DecayCard',
    'DepthCarousel',
    'Dock',
    'DomeGallery',
    'DriftWall',
    'ElasticSlider',
    'FlowingMenu',
    'FluidGlass',
    'FlyingPosters',
    'Folder',
    'GlassIcons',
    'GlassSurface',
    'GooeyNav',
    'InfiniteMenu',
    'InfiniteSpiral',
    'Lanyard',
    'LineSidebar',
    'MagicBento',
    'Masonry',
    'ModelViewer',
    'MorphSlider',
    'OptionWheel',
    'PillNav',
    'PixelCard',
    'ProfileCard',
    'ReflectiveCard',
    'ScrollStack',
    'SpecularButton',
    'SpotlightCard',
    'Stack',
    'StaggeredMenu',
    'Stepper',
    'TiltedCard',
  ],
  TextAnimations: [
    'ASCIIText',
    'BlurText',
    'CircularText',
    'CountUp',
    'CurvedLoop',
    'DecryptedText',
    'DepthText',
    'EchoText',
    'FallingText',
    'FoldText',
    'FuzzyText',
    'GlitchText',
    'GradientText',
    'MaskedHeading',
    'ParticleText',
    'RotatingText',
    'ScrambledText',
    'ScrollFloat',
    'ScrollReveal',
    'ScrollVelocity',
    'ShinyText',
    'Shuffle',
    'SplitFlapText',
    'SplitText',
    'StrokeText',
    'TextCursor',
    'TextLoop',
    'TextPressure',
    'TextType',
    'TrueFocus',
    'VariableProximity',
    'WarpText',
  ],
};

export const CATALOGUE_TOTAL = Object.values(CATALOGUE).reduce(
  (sum, names) => sum + names.length,
  0,
);

export function sectionMeta(section: ReactBitsSection) {
  const meta = SECTIONS.find((entry) => entry.section === section);
  if (!meta) throw new Error(`Unknown React Bits section: ${section}`);
  return meta;
}

// 'FadeContent' -> 'fade-content'. 'ASCIIText' -> 'ascii-text'. 'CRTWarp' -> 'crt-warp'.
export function kebabName(name: string): string {
  return name
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2')
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .toLowerCase();
}

// 'FadeContent' -> 'Fade Content'. 'ASCIIText' -> 'ASCII Text'.
export function displayName(name: string): string {
  return name
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2');
}

// Story title. 'React Bits/Animations/Fade Content'.
export function storyTitle(section: ReactBitsSection, name: string): string {
  return `React Bits/${sectionMeta(section).label}/${displayName(name)}`;
}

// Story id of the Default story. 'react-bits-animations-fade-content--default'.
export function storyId(section: ReactBitsSection, name: string, story = 'default'): string {
  const slug = storyTitle(section, name)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  return `${slug}--${story}`;
}

// Upstream documentation page. 'https://reactbits.dev/animations/fade-content'.
export function pageUrl(section: ReactBitsSection, name: string): string {
  return `${REACT_BITS_SITE}/${sectionMeta(section).folder}/${kebabName(name)}`;
}

// Upstream file at the pinned commit.
export function upstreamFileUrl(section: ReactBitsSection, relativePath: string): string {
  return `${REACT_BITS_REPO}/blob/${REACT_BITS_SHA}/src/ts-default/${section}/${relativePath}`;
}
