import { strict as assert } from 'node:assert';
import { createVisitorMapByUser, createSessionsByUser } from '../sessionView.js'

const exampleInput = {
    "events": [
         {
             "url": "/pages/a-big-river",
             "visitorId": "d1177368-2310-11e8-9e2a-9b860a0d9039",
             "timestamp": 1512754583000
         },
         {
             "url": "/pages/a-small-dog",
             "visitorId": "d1177368-2310-11e8-9e2a-9b860a0d9039",
             "timestamp": 1512754631000
         },
        {
            "url": "/pages/a-big-talk",
            "visitorId": "f877b96c-9969-4abc-bbe2-54b17d030f8b",
            "timestamp": 1512709065294
        },
        {
            "url": "/pages/a-sad-story",
            "visitorId": "f877b96c-9969-4abc-bbe2-54b17d030f8b",
            "timestamp": 1512711000000
        },
        {
            "url": "/pages/a-big-river",
            "visitorId": "d1177368-2310-11e8-9e2a-9b860a0d9039",
            "timestamp": 1512754436000
        },
        {
            "url": "/pages/a-sad-story",
            "visitorId": "f877b96c-9969-4abc-bbe2-54b17d030f8b",
            "timestamp": 1512709024000
        }
    ]
}

const exampleOutput = {
    "sessionsByUser": {
        "f877b96c-9969-4abc-bbe2-54b17d030f8b": [
            {
                "duration": 41294,
                "pages": [
                    "/pages/a-sad-story",
                    "/pages/a-big-talk"
                ],
                "startTime": 1512709024000
            },
            {
                "duration": 0,
                "pages": [
                    "/pages/a-sad-story"
                ],
                "startTime": 1512711000000
            }
        ],
        "d1177368-2310-11e8-9e2a-9b860a0d9039": [
            {
                "duration": 195000,
                "pages": [
                    "/pages/a-big-river",
                    "/pages/a-big-river",
                    "/pages/a-small-dog"
                ],
                "startTime": 1512754436000
            }
        ]
    }
}

describe('example test', () => {
    it('example input should get example output', () => {
        const { events } = exampleInput
        const visitorMap = createVisitorMapByUser(events)
        const sessionsByUser = createSessionsByUser(visitorMap)
        assert.deepEqual(exampleOutput, sessionsByUser)
    });
  });