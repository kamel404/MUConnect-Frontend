import { SimpleGrid } from "@chakra-ui/react";
import StudyGroupCard from "./StudyGroupCard";
import EmptyState from "./EmptyState";

const StudyGroupList = ({ groups, onJoinLeave, onEdit, onDelete, currentUser, emptyStateType }) => {
  if (groups.length === 0) {
    return <EmptyState type={emptyStateType} />;
  }

  return (
    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
      {groups.map(group => (
        <StudyGroupCard
          key={group.id}
          group={group}
          onJoinLeave={onJoinLeave}
          onEdit={onEdit}
          onDelete={onDelete}
          currentUser={currentUser}
        />
      ))}
    </SimpleGrid>
  );
};

export default StudyGroupList;
