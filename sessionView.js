import axios from "axios"


axios.get('https://candidate.hubteam.com/candidateTest/v3/problem/dataset?userKey=3aff0a0e7579df880719fe7b33dc').then(res => {
    const { data: { events } } = res
    const visitorMap = createVisitorMapByUser(events)
    const sessionsByUser = createSessionsByUser(visitorMap)

    axios.post('https://candidate.hubteam.com/candidateTest/v3/problem/result?userKey=3aff0a0e7579df880719fe7b33dc', sessionsByUser).then(res => {
        console.log('res in the post:', res)
    }).catch(error => {
        console.log('error in post request:', error)
    })

}).catch(error => {
    console.log('error in get request', error)
})


export const createVisitorMapByUser = (events) => {
    const visitorMap = new Map()
    for (const event of events) {
        if (!visitorMap.has(event.visitorId)) {
            visitorMap.set(event.visitorId, new Map())
        }
        visitorMap.get(event.visitorId).set(event.timestamp, event.url)
    }
    return visitorMap
}

const makeSessions = (timestamps, urlMap) => {
    let start = 0
    const sessions = []
    sessions.push({
        "duration": 0,
        "pages": [urlMap.get(timestamps[0])],
        "startTime": timestamps[0]
    })

    for (let i = 1; i < timestamps.length; i++) {
        // if the next event occurs within 10 minutes which is 600000 milliseconds, 
        // we're going to modify the pages and duration of the last session we pushed.
        if (timestamps[i] - timestamps[start] < 600000) {
            let lastSession = sessions[sessions.length-1]
            lastSession.duration = timestamps[i] - timestamps[start]
            lastSession.pages.push(urlMap.get(timestamps[i]))
        } else {
            sessions.push({
                "duration": 0,
                "pages": [urlMap.get(timestamps[i])],
                "startTime": timestamps[i]
            })
            start = i
        }
    }
    return sessions
}

export const createSessionsByUser = (visitorMap) => {
    const sessionsByUser = {}

    visitorMap.forEach((urlMap, user) => {
        // sort urls by timestamps
        const timestamps = Array.from(urlMap.keys()).sort((a,b) => a-b)
        const sessions = makeSessions(timestamps, urlMap)
        sessionsByUser[user] = sessions
    })

    return {"sessionsByUser": sessionsByUser}
}

export default {
    createVisitorMapByUser,
    createSessionsByUser
}