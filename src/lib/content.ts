import type { ServiceId, ServiceIconName } from './service-catalog';

export type Service = {
  id: ServiceId;
  number: string;
  name: string;
  problem: string;
  short: string;
  description: string;
  icon: ServiceIconName;
  tag: string;
  title: string;
  intro: string;
  scope: readonly string[];
  prepare: readonly string[];
  limit: string;
};

/** Planned catalogue for preview; live availability requires service-specific approval. */
export const services: readonly Service[] = [
  {
    id: 'local-towing', number: '01', name: 'Car towing', problem: 'NEED A CAR TOW?',
    short: 'A breakdown. A way forward.',
    description: 'Local car breakdown towing with suitable equipment and your destination confirmed.',
    icon: 'truck', tag: 'WHEN DRIVING IS NOT AN OPTION',
    title: 'Car towing for an eligible local breakdown.',
    intro: 'A local car breakdown tow requires the right operator and equipment for the vehicle, pickup location and destination. Availability, arrival estimate and the full quote must be confirmed before service.',
    scope: [
      'An eligible local breakdown tow accepted by an authorized independent operator.',
      'Equipment and service depend on vehicle type, condition and safe access.',
      'Collision recovery, impounds and restricted-road work are not included by default.',
    ],
    prepare: [
      'Your vehicle make, model, condition and whether it can roll.',
      'A general pickup area first; share precise location with the confirmed service team only when needed.',
      'Your preferred destination and any access or parking restrictions.',
    ],
    limit: 'A website request is not a dispatch confirmation. Restricted roads and hazardous locations require appropriate authorized handling; a general service partner may not be permitted to attend.',
  },
  {
    id: 'heavy-duty-towing', number: '02', name: 'Heavy duty towing', problem: 'LARGER VEHICLE STRANDED?',
    short: 'A larger vehicle. The right equipment.',
    description: 'Heavy vehicle towing enquiries matched to verified capacity, load and safe access.',
    icon: 'heavy-duty', tag: 'WHEN A STANDARD TOW IS NOT SUITABLE',
    title: 'Heavy duty towing starts with a vehicle and load assessment.',
    intro: 'Heavy duty towing needs an operator authorized and equipped for the specific vehicle and load. Describe the vehicle, weight and site so the team can check suitable capacity before any quote or dispatch is confirmed.',
    scope: [
      'Assessment of eligible heavy vehicle breakdown enquiries against available operator capacity.',
      'Equipment and tow method depend on actual dimensions, loaded weight, axle layout and vehicle condition.',
      'Cargo handling, trailer recovery, permits and specialist recovery are separate arrangements unless expressly agreed.',
    ],
    prepare: [
      'Vehicle type, dimensions, gross or loaded weight, and any attached trailer.',
      'Whether it can roll or steer, its load type and any hazardous-material concerns.',
      'Pickup access, overhead or weight restrictions and the intended destination.',
    ],
    limit: 'Capacity is not assumed for every truck, bus or load. Restricted-road, collision and hazardous-load incidents require the appropriate authorized pathway and may be outside the available service.',
  },
  {
    id: 'motorcycle-towing', number: '03', name: 'Motorcycle towing', problem: 'BIKE NEEDS A TOW?',
    short: 'Two wheels. Carefully matched transport.',
    description: 'Motorcycle transport enquiries with suitable loading, securement and access checks.',
    icon: 'motorcycle', tag: 'WHEN YOUR MOTORCYCLE CANNOT CONTINUE',
    title: 'Motorcycle towing with suitable transport confirmed.',
    intro: 'Motorcycle towing requires a partner with equipment and securement appropriate for your bike. The team must confirm the motorcycle type, condition, loading access and destination before accepting the job.',
    scope: [
      'Transport of an eligible motorcycle by a partner with suitable loading and securement equipment.',
      'Suitability depends on bike weight, dimensions, modifications and whether the wheels can roll.',
      'Collision recovery, specialty bikes and additional luggage or passenger transport require separate confirmation.',
    ],
    prepare: [
      'Motorcycle make, model and approximate weight, including any sidecar or modifications.',
      'Whether it rolls and steers, and whether the keys are available.',
      'A safe pickup area, access limitations and your preferred destination.',
    ],
    limit: 'A standard car towing setup may be unsuitable for a motorcycle. Equipment, safe loading and partner acceptance must be checked; do not attempt to ride a damaged or unsafe bike.',
  },
  {
    id: 'battery-boost', number: '04', name: 'Boosting & jump start', problem: 'CAR WILL NOT START?',
    short: 'Low battery. Get a clear next step.',
    description: 'Battery boost help when a discharged battery is suitable for a jump start.',
    icon: 'battery', tag: 'WHEN YOUR CAR WILL NOT START',
    title: 'Jump start and battery boost help for a no-start.',
    intro: 'A battery boost may help when the battery is discharged. It cannot fix every no-start problem, so describe what happens when you try to start the vehicle.',
    scope: [
      'A partner checks whether a boost is appropriate for your vehicle.',
      'Vehicle type, battery condition and access affect whether help is possible.',
      'Diagnosis, battery replacement and repair are separate services unless expressly quoted.',
    ],
    prepare: [
      'Your vehicle make, model and year.',
      'Whether dashboard lights come on, and any clicking or other symptoms.',
      'Whether the vehicle is in a safely accessible location.',
    ],
    limit: 'Do not try to boost a damaged, leaking, swollen or frozen battery. Follow your vehicle manufacturer guidance; some hybrids and electric vehicles have specific requirements.',
  },
  {
    id: 'winch-out', number: '05', name: 'Winch out', problem: 'VEHICLE STUCK?',
    short: 'Stuck vehicle. Assess the site first.',
    description: 'Winch-out assessment for a stuck vehicle where access, ground and equipment are suitable.',
    icon: 'winch', tag: 'WHEN YOUR VEHICLE CANNOT GET TRACTION',
    title: 'Winch-out help with a safe site assessment first.',
    intro: 'A stuck vehicle needs a site and equipment assessment before a winch out can be accepted. Tell the team about the ground, vehicle position and safe access so an appropriate partner can decide whether the work is feasible.',
    scope: [
      'Assessment of an eligible stuck vehicle at a safely accessible, permitted site.',
      'Work only when the operator confirms suitable equipment, vehicle recovery points and ground conditions.',
      'Ditch extraction, rollovers, collision recovery and restricted-road work are not included by default.',
    ],
    prepare: [
      'Your vehicle type and whether it is stuck in snow, mud or another surface.',
      'Its position, visible damage and nearby hazards, described from a safe place.',
      'Access restrictions, property permission and whether there is safe room for recovery equipment.',
    ],
    limit: 'Do not attach ropes, stand near tensioned recovery equipment or attempt a pull yourself. Unsafe ground, deep water, restricted roads or collision scenes may require a specialist or emergency response.',
  },
  {
    id: 'flat-tire', number: '06', name: 'Flat tire', problem: 'NOT SURE WHAT YOUR TIRE NEEDS?',
    short: 'A flat tire. Choose a suitable next step.',
    description: 'Help assessing a flat tire and arranging a spare change, repair enquiry or tow as appropriate.',
    icon: 'flat-tire', tag: 'WHEN YOU NEED A PLAN FOR A FLAT',
    title: 'Flat tire help to assess your next step.',
    intro: 'A flat tire does not always call for the same service. Describe the damage, spare availability and stopping location so the team can check whether a tire change, repair assessment or towing is appropriate.',
    scope: [
      'An initial discussion of the tire problem, stopping location and available spare.',
      'Matching the enquiry to spare-wheel installation, a repair assessment or towing when a suitable partner is available.',
      'The actual work, equipment, repair suitability and price must be confirmed before service; tire replacement is not included automatically.',
    ],
    prepare: [
      'Whether the tire is losing pressure or fully flat, and any visible damage you can describe safely.',
      'Whether you have a usable spare, tire repair kit and wheel-lock key.',
      'Your vehicle type and whether it is stopped away from moving traffic on suitable ground.',
    ],
    limit: 'Do not drive on a flat or visibly damaged tire. An initial enquiry cannot establish that a tire is repairable or that a roadside wheel change is safe; the partner must assess the situation.',
  },
  {
    id: 'flat-tire-help', number: '07', name: 'Tire change', problem: 'HAVE A SPARE TO FIT?',
    short: 'Your spare. A practical way forward.',
    description: 'Help fitting your existing, usable spare when the location and vehicle allow.',
    icon: 'tire', tag: 'WHEN A SUITABLE SPARE IS AVAILABLE',
    title: 'Roadside tire change help with your usable spare.',
    intro: 'Roadside tire change help is intended for fitting an existing, usable spare. The work depends on safe access, the right equipment and the condition of the vehicle.',
    scope: [
      'Fitment of a suitable spare you already have, if safe and compatible.',
      'Availability depends on access, wheel condition and any locking wheel nuts.',
      'New tires, puncture repairs and damaged-wheel recovery are not included unless specifically agreed.',
    ],
    prepare: [
      'Whether you have a usable spare and its location in the vehicle.',
      'Your make and model, and whether the wheel-lock key is available.',
      'Whether the vehicle is away from moving traffic and on suitable ground.',
    ],
    limit: 'Never change a wheel in an active traffic lane. If a roadside change is unsafe or no usable spare is available, ask about an appropriate recovery option.',
  },
  {
    id: 'lockout', number: '08', name: 'Lockout', problem: 'KEYS LOCKED INSIDE?',
    short: 'Locked out. Know your options.',
    description: 'Vehicle access assistance, subject to ownership checks and a suitable service partner.',
    icon: 'lockout', tag: 'WHEN YOUR KEYS ARE OUT OF REACH',
    title: 'Vehicle lockout help with permission and care.',
    intro: 'A lockout partner must confirm that you own the vehicle or have authority to access it. The vehicle, lock system and available equipment determine whether roadside entry is suitable.',
    scope: [
      'Entry assistance for an eligible vehicle after ownership or access authority is verified.',
      'The partner explains the proposed approach, limitations and quote before you consent.',
      'Key cutting, replacement keys, programming and damaged-lock repair are separate work unless quoted.',
    ],
    prepare: [
      'Your vehicle make, model and year, and whether the keys are inside or missing.',
      'Proof of ownership or authority to use the vehicle, to be checked by the service partner.',
      'Any relevant access restrictions or vehicle security-system details.',
    ],
    limit: 'Do not attempt to force entry. If anyone is in immediate danger inside a locked vehicle, contact emergency services rather than waiting for a roadside request.',
  },
  {
    id: 'fuel-delivery', number: '09', name: 'Fuel delivery', problem: 'OUT OF FUEL?',
    short: 'An empty tank. A confirmed fuel plan.',
    description: 'Delivery of compatible fuel, with fuel type, quantity and charges confirmed first.',
    icon: 'fuel', tag: 'WHEN THE TANK RUNS EMPTY',
    title: 'Roadside fuel delivery with the details confirmed first.',
    intro: 'Fuel delivery depends on the correct fuel being available and the vehicle being safely accessible. Confirm the fuel specification, quantity, delivery charge and fuel cost before accepting service.',
    scope: [
      'Delivery of an agreed quantity of fuel compatible with your vehicle.',
      'Fuel supply, handling and any vehicle-specific restart requirements must be confirmed by the partner.',
      'Wrong-fuel removal, fuel-system repairs and electric-vehicle charging are separate services.',
    ],
    prepare: [
      'Your vehicle make, model, year and required fuel type or grade.',
      'Whether the vehicle stopped after running low, or another problem is suspected.',
      'Any fuel-door access issue and a general description of the safe stopping location.',
    ],
    limit: 'Do not add fuel if you suspect a leak or the wrong fuel has already been added. Tell the service team so they can assess a suitable next step.',
  },
  {
    id: 'battery-replacement', number: '10', name: 'Battery replacement', problem: 'BATTERY NEEDS REPLACING?',
    short: 'The right battery. A clear quote.',
    description: 'Replacement support after battery compatibility, supply and installation are confirmed.',
    icon: 'battery-replacement', tag: 'WHEN A BOOST IS NOT THE ANSWER',
    title: 'Vehicle battery replacement with compatibility checked.',
    intro: 'Battery replacement requires a suitable battery and a partner equipped for your vehicle. Assessment, battery supply, installation, any programming and old-battery handling should be explained in the quote before you consent.',
    scope: [
      'Assessment of whether replacement is appropriate and whether the correct battery is available.',
      'An agreed compatible battery and installation where the vehicle and location are suitable.',
      'Battery cost, labour, registration or coding, warranty terms and disposal charges must be confirmed separately.',
    ],
    prepare: [
      'Your vehicle make, model and year, including start-stop, hybrid or electric-vehicle details.',
      'Any previous battery or charging-system diagnosis and current no-start symptoms.',
      'Any known battery-access restrictions; share further vehicle details only with the confirmed partner when needed.',
    ],
    limit: 'A new battery will not resolve every starting or charging fault. High-voltage traction batteries are outside this roadside replacement scope.',
  },
  {
    id: 'tire-repair', number: '11', name: 'Tire repair', problem: 'PUNCTURED TIRE?',
    short: 'A puncture. Assess before repair.',
    description: 'Puncture assessment and repair where tire condition, equipment and location allow.',
    icon: 'tire-repair', tag: 'WHEN A TIRE MAY BE REPAIRABLE',
    title: 'Tire repair starts with a proper suitability assessment.',
    intro: 'Not every puncture can be repaired, and not every repair can be performed safely at the roadside. A suitable partner must assess the tire, damage and available facilities before recommending and quoting the work.',
    scope: [
      'Inspection to establish whether the tire is suitable for repair.',
      'Repair only when the damage, tire condition, equipment and safe working location permit.',
      'Tire replacement, wheel damage and transport to a repair facility are quoted separately if needed.',
    ],
    prepare: [
      'Your vehicle type and tire size, if you can check them safely.',
      'Where the visible damage is, whether the tire is flat and whether it was driven flat.',
      'Whether a usable spare and wheel-lock key are available as an alternative.',
    ],
    limit: 'Do not drive on a flat or visibly damaged tire. Sidewall damage and other unsafe conditions may rule out repair; ask about a spare-wheel change or towing when needed.',
  },
];

export const faqs = [
  { question: 'Can I book a service right now?', answer: 'This is a pre-launch preview. Calls, callbacks and dispatch are not currently available through this site. The service information explains the intended process; it does not confirm partner coverage.' },
  { question: 'Who carries out the roadside work?', answer: 'The proposed model uses a separately managed call centre to coordinate independent roadside or towing partners. The final business identity, responsibilities and partner coverage must be verified before service begins.' },
  { question: 'How will I know the price?', answer: 'Before accepting a service, ask for the operator identity, the work included, the total quote and any taxes or possible extra charges. An estimate or website request does not authorize additional work.' },
  { question: 'Can you tell me an arrival time?', answer: 'There are no verified response-time promises on this site. Once operating, the service team must confirm an estimate based on your location, road conditions and available partners, and explain any changes.' },
  { question: 'Does requesting help mean a truck is on its way?', answer: 'No. A callback request is only a request to speak with the team. Service is not dispatched until a suitable operator accepts the job and the required quote and consent steps are completed.' },
];
