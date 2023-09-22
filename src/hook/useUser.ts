// import { getUserInfo, createUser } from "../api/firebase"; // import Firebase API functions

function useUser() {
  // const { data: user, isLoading, isError, refetch } = useQuery("user", getUserInfo);
  // const createUserMutation = useMutation(createUser, {
  //   onSuccess: (data) => {
  //     // if a new user was created, refetch the user query to get the updated user data
  //     refetch();
  //   },
  // });
  // const createUserIfNeeded = async () => {
  //   if (!user) {
  //     // if the user does not exist, create a new user
  //     await createUserMutation.mutateAsync();
  //   }
  // };
  // // call the createUserIfNeeded function when the component mounts
  // useEffect(() => {
  //   createUserIfNeeded();
  // }, []);
  // return {
  //   user,
  //   isLoading,
  //   isError,
  // };
}

export default useUser
