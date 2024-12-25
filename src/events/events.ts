enum Events {
  ADD_TO_QUEUE = 'ADD_TO_QUEUE',
  FETCH_ALL_RECORDS = 'FETCH_ALL_RECORDS',
  DELETE_QUEUE = 'DELETE_QUEUE',
  GET_CONSUMER_GROUPS = 'GET_CONSUMER_GROUPS',
  ADDED_TO_QUEUE = 'ADDED_TO_QUEUE',
  INITIALIZE_CONSUMER_GROUP = 'INITIALIZE_CONSUMER_GROUP',
  READ_FROM_CONSUMER_GROUP = 'READ_FROM_CONSUMER_GROUP',
  ACK_MESSAGE_IN_CONSUMER_GROUP = 'ACK_MESSAGE_IN_CONSUMER_GROUP',
  DESTROY_CONSUMER_GROUP = 'DESTROY_CONSUMER_GROUP',
}

export default Events;