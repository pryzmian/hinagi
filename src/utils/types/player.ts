export enum DestroyReason {
    NoResultsFound = "no results found for the provided query.",
    QueueEmpty = "the queue is empty.",
    NodeDestroyed = "the node was destroyed.",
    NodeDeleted = "the node was deleted.",
    LavalinkNoVoice = "the Lavalink node has no voice channel associated with it.",
    NodeReconnectFail = "the node failed to reconnect.",
    Disconnected = "the client disconnected from the server.",
    PlayerReconnectFail = "the player failed to reconnect.",
    ChannelDeleted = "the voice channel was deleted.",
    DisconnectAllNodes = "all nodes were disconnected.",
    ReconnectAllNodes = "all nodes were reconnected.",
}
