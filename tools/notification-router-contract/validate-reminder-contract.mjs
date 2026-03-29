const e164Pattern = /^\+[1-9]\d{7,14}$/;

function validateContract(event) {
  const requiredFields = ['id', 'priority', 'userMessage', 'whatsappTarget'];
  for (const field of requiredFields) {
    if (!event[field]) {
      throw new Error(`Invalid reminder config: missing required field "${field}".`);
    }
  }

  if (!e164Pattern.test(event.whatsappTarget)) {
    throw new Error(
      'Invalid reminder config: whatsappTarget must be a valid E.164 number.',
    );
  }
}

function routeReminder({ event, desktopResult, whatsappResult }) {
  validateContract(event);

  if (desktopResult === 'ok') {
    return {
      outcome: 'desktop_only',
      userVisibleMessage: event.userMessage,
      fallbackUsed: false,
    };
  }

  if (!e164Pattern.test(event.whatsappTarget)) {
    throw new Error(
      'Invalid reminder config: whatsappTarget must be a valid E.164 number.',
    );
  }

  if (whatsappResult !== 'ok') {
    throw new Error('WhatsApp fallback failed after desktop delivery failure.');
  }

  return {
    outcome: 'whatsapp_fallback',
    userVisibleMessage: event.userMessage,
    fallbackUsed: true,
  };
}

const scenarios = [
  {
    name: 'desktop ok, no fallback',
    input: {
      event: {
        id: 'reminder-1',
        priority: 'high',
        userMessage: 'Time to join your planning call.',
        whatsappTarget: '+15551234567',
      },
      desktopResult: 'ok',
      whatsappResult: 'skipped',
    },
    assert(result) {
      if (result.outcome !== 'desktop_only' || result.fallbackUsed !== false) {
        throw new Error('Expected desktop delivery without fallback.');
      }
    },
  },
  {
    name: 'desktop fails, WhatsApp fallback succeeds',
    input: {
      event: {
        id: 'reminder-2',
        priority: 'normal',
        userMessage: 'Daily standup starts in 15 minutes.',
        whatsappTarget: '+15551234567',
      },
      desktopResult: 'timeout',
      whatsappResult: 'ok',
    },
    assert(result) {
      if (
        result.outcome !== 'whatsapp_fallback' ||
        result.fallbackUsed !== true
      ) {
        throw new Error('Expected WhatsApp fallback after desktop failure.');
      }
    },
  },
  {
    name: 'desktop fails, missing WhatsApp target throws config error',
    input: {
      event: {
        id: 'reminder-3',
        priority: 'high',
        userMessage: 'Pick up your package.',
        whatsappTarget: '',
      },
      desktopResult: 'refused',
      whatsappResult: 'skipped',
    },
    assertError(error) {
      if (
        error.message !==
        'Invalid reminder config: missing required field "whatsappTarget".'
      ) {
        throw error;
      }
    },
  },
];

let failures = 0;

for (const scenario of scenarios) {
  try {
    const result = routeReminder(scenario.input);
    if (scenario.assert) {
      scenario.assert(result);
    } else {
      throw new Error('Expected scenario to throw.');
    }
    console.log(`PASS: ${scenario.name}`);
  } catch (error) {
    if (scenario.assertError) {
      try {
        scenario.assertError(error);
        console.log(`PASS: ${scenario.name}`);
      } catch (assertionError) {
        failures += 1;
        console.error(`FAIL: ${scenario.name}`);
        console.error(assertionError.message);
      }
    } else {
      failures += 1;
      console.error(`FAIL: ${scenario.name}`);
      console.error(error.message);
    }
  }
}

if (failures > 0) {
  process.exitCode = 1;
} else {
  console.log('All notification router contract checks passed.');
}
