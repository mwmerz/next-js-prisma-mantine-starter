import { Box, Stack } from "@mantine/core";
import { User } from "@/types";
import { UserItem } from "./UserItem";

export function UserList({ users }: { users: { [key: string]: User } }) {
  return (
    <Box mt={16}>
      <Stack>
        {Object.keys(users).map((key) => (
          <UserItem key={key} user={users[key]} />
        ))}
      </Stack>
    </Box>
  );
}
