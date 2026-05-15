import { useTopicStore } from "./topic.store";

export const useTopics = () => {
  const topics = useTopicStore((s) => s.topics);
  const addTopic = useTopicStore((s) => s.addTopic);
  const deleteTopic = useTopicStore((s) => s.deleteTopic);

  return { topics, addTopic, deleteTopic };
};
