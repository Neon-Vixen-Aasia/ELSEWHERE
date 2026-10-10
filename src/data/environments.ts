import { EnvironmentInfo, Oddity } from '../types';

export const ENVIRONMENTS: Record<string, EnvironmentInfo> = {
  'quiet-room': {
    id: 'quiet-room',
    name: 'The Quiet Room',
    subtitle: 'Nostalgic sunlight & translucent curtains',
    era: 'Hour of Pale Amber',
    imagePath: '/src/assets/images/scene_quiet_room_1791619418918.jpg',
    palette: {
      ambient: '#f6f1eb',
      accent: '#c99e64',
      tint: 'rgba(215, 185, 140, 0.12)'
    }
  },
  'infinite-garden': {
    id: 'infinite-garden',
    name: 'The Infinite Garden',
    subtitle: 'Faded paths & wildflowers toward the haze',
    era: 'Hour of Eucalyptus & Salt',
    imagePath: '/src/assets/images/scene_infinite_garden_1791619429422.jpg',
    palette: {
      ambient: '#eef1e6',
      accent: '#8d9b73',
      tint: 'rgba(141, 155, 115, 0.12)'
    }
  },
  'floating-shore': {
    id: 'floating-shore',
    name: 'The Floating Shore',
    subtitle: 'Still reflective water & suspended stones',
    era: 'Hour of Glass & Twilight',
    imagePath: '/src/assets/images/scene_floating_shore_1791619441493.jpg',
    palette: {
      ambient: '#eae5ee',
      accent: '#958da5',
      tint: 'rgba(149, 141, 165, 0.12)'
    }
  },
  'cloud-observatory': {
    id: 'cloud-observatory',
    name: 'The Cloud Observatory',
    subtitle: 'High architecture suspended above quiet mist',
    era: 'Hour of Weightless Arches',
    imagePath: '/src/assets/images/scene_cloud_observatory_1791619452290.jpg',
    palette: {
      ambient: '#edf2f7',
      accent: '#7a8fa6',
      tint: 'rgba(122, 143, 166, 0.12)'
    }
  },
  'night-window': {
    id: 'night-window',
    name: 'The Night Window',
    subtitle: 'Deep indigo stillness & soft warm lamp',
    era: 'Hour of the Unhurried Moon',
    imagePath: '/src/assets/images/scene_night_window_1791619463127.jpg',
    palette: {
      ambient: '#131824',
      accent: '#d4a259',
      tint: 'rgba(212, 162, 89, 0.14)'
    }
  }
};

export const INITIAL_ODDITIES: Oddity[] = [
  {
    id: 'cloud-ship',
    environmentId: 'quiet-room',
    title: 'The Drifting Mast',
    description: 'A miniature wooden vessel floating slowly across the clouds beyond the window ledge, leaving no wake.'
  },
  {
    id: 'singing-stone',
    environmentId: 'infinite-garden',
    title: 'The Quiet Inscription',
    description: 'An ancient limestone marker hidden beneath ivy that reads: "You are allowed to remain here as long as you wish."'
  },
  {
    id: 'paper-boat-cloud',
    environmentId: 'infinite-garden',
    title: 'Folded Sky',
    description: 'A cloud in the upper horizon that took the exact shape of a folded paper boat before dissolving into mist.'
  },
  {
    id: 'floating-capsule',
    environmentId: 'floating-shore',
    title: 'Memory of Still Tide',
    description: 'A pale hollow pebble resting in the shallows that hums softly with the sound of rain from twenty years ago.'
  },
  {
    id: 'miniature-world-sphere',
    environmentId: 'cloud-observatory',
    title: 'The Encapsulated Valley',
    description: 'Within the glass sphere on the pedestal, tiny lanterns flickered on hills that do not exist on any map.'
  },
  {
    id: 'inverted-constellation',
    environmentId: 'night-window',
    title: 'The Steamed Sky Map',
    description: 'Wiping away the night condensation revealed stars arranged in the shape of a key that unlocks no door.'
  },
  {
    id: 'brass-watch',
    environmentId: 'night-window',
    title: 'The Stopped Pocket Watch',
    description: 'Tucked inside the walnut drawer, a mechanical timepiece whose secondhand rocks back and forth without advancing.'
  }
];

export const CODEX_PAGES = [
  {
    title: 'Fragment 01: On Leaving the Day Behind',
    date: 'Autumn, Year of No Urgency',
    body: 'The clock on the wall has two hands, but neither of them is interested in moving forward. When the afternoon sun touches the corner of this table, dust motes hang in the air like thoughts you decided not to finish thinking.'
  },
  {
    title: 'Fragment 02: The Geography of Rooms We Remember',
    date: 'Undated note in pencil',
    body: 'There is a room everyone visits once when they are seven years old, smelling of cedarwood and cold linen. You do not remember how you arrived, only that the window was open and the wind sounded like a friend humming from the hallway.'
  },
  {
    title: 'Fragment 03: Instructions for Water',
    date: 'Written in faded sepia ink',
    body: 'If you place your fingertips into still water, do not disturb it with intent. The ripples are not answering you; they are simply making room for your presence. Watch until the last ring dissolves into the edge of the sky.'
  },
  {
    title: 'Fragment 04: The Habit of Looking Away',
    date: 'Folded page marked with dried chamomile',
    body: 'Nothing here requires proof. If you find a door that leads to a sea of clouds, step through. You do not have to explain to anyone why you needed twenty minutes of silence.'
  }
];
