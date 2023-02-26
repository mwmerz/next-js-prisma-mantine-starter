import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Box, Group, ActionIcon } from "@mantine/core";
import { IconTrash, IconEdit } from "@tabler/icons-react";
import request from "axios";
import { User } from "@/types";

export function UserItem({ user }: { user: User }) {
  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: async () => {
      try {
        await request.delete("./api/user", {
          data: {
            uuid: user.id,
          },
        });
        return true;
      } catch (error) {
        throw new Error(JSON.stringify(error));
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
  return (
    <Box sx={{ border: "1px solid lightgrey", borderRadius: 4 }} p={8}>
      <Group position={"apart"}>
        <Box>{user.name}</Box>
        <Group position={"right"}>
          <ActionIcon variant={"outline"} color={"blue"}>
            <IconEdit />
          </ActionIcon>
          <ActionIcon
            onClick={() => {
              deleteMutation.mutate();
            }}
            variant={"outline"}
            color={"red"}
          >
            <IconTrash />
          </ActionIcon>
        </Group>
      </Group>
    </Box>
  );
}
