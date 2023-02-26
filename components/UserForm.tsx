import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, TextInput, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import request from "axios";

export function UserForm() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: postForm,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: () => {
      console.log("error in onError");
    },
  });

  async function postForm(values: { name: string }) {
    try {
      await request.post("./api/user", {
        name: values.name,
      });
      form.reset();
      return true;
    } catch (error) {
      throw new Error(JSON.stringify(error));
    }
  }

  function handleSubmit(values: { name: string }) {
    mutation.mutate({
      name: values.name,
    });
  }

  const form = useForm({
    initialValues: {
      name: "",
    },
    validate: {
      name: (value) => (/^[\S]*$/.test(value) ? null : "Spaces Not Allowed."),
    },
  });
  return (
    <Stack>
      <h1>Test Form</h1>
      <form
        onSubmit={form.onSubmit((values) => handleSubmit(values))}
        autoComplete={"off"}
      >
        <Stack>
          <TextInput
            placeholder={"New Name"}
            label={"Name"}
            withAsterisk
            {...form.getInputProps("name")}
          />
          <Button type={"submit"}>Post</Button>
        </Stack>
      </form>
    </Stack>
  );
}
