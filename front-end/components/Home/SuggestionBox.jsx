import {
  Box,
  Avatar,
  Text,
  Center,
  Spacer,
  HStack,
  Stack,
  Flex,
  Show,
} from "@chakra-ui/react";

const posts = [
  {
    userId: 1,
    username: "jordan",
    location: "BSD",
    image_url:
      "https://imageio.forbes.com/specials-images/imageserve/62278bc6897b081d1eef49ea/2022-BMW-i4-coup--electric-car/960x0.jpg?format=jpg&width=960",
    number_of_likes: 1234,
    caption:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Vero dolore enim praesentium inventore asperiores sunt corporis unde dicta ipsa dolorum voluptatibus dolor, odio nobis est consequuntur labore!",
    id: 1,
  },
  {
    userId: 2,
    username: "jason",

    location: "Jakarta",
    image_url:
      "https://cdn.motor1.com/images/mgl/kv0WY/s3/bmw-modellpflege-massnahmen-zum-sommer-2021.jpg",
    number_of_likes: 23123,
    caption:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Vero dolore enim praesentium inventore asperiores sunt corporis unde dicta ipsa dolorum voluptatibus dolor, odio nobis est consequuntur labore!",
    id: 2,
  },
  {
    userId: 3,
    username: "badra",
    location: "Bandung",
    image_url:
      "https://images.netdirector.co.uk/gforces-auto/image/upload/q_auto,c_crop,f_auto,fl_lossy,x_276,y_90,w_1320,h_988/w_744,h_558,c_fill/auto-client/fede2c14655c9c97e6c274c8dce66dcb/x7_landing_pages_1920x1080_01_37_.jpg",
    number_of_likes: 54354353,
    caption:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Vero dolore enim praesentium inventore asperiores sunt corporis unde dicta ipsa dolorum voluptatibus dolor, odio nobis est consequuntur labore!",
    id: 3,
  },
  {
    userId: 4,
    username: "Alex",
    location: "Bandung",
    image_url:
      "https://www.whatspaper.com/wp-content/uploads/2021/05/bmw-wallpaper-whatspaper-3.jpg",
    number_of_likes: 54354353,
    caption:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Vero dolore enim praesentium inventore asperiores sunt corporis unde dicta ipsa dolorum voluptatibus dolor, odio nobis est consequuntur labore!",
    id: 4,
  },
  {
    userId: 5,
    username: "Fakhri",
    location: "Bandung",
    image_url: "https://picsum.photos/1700/1200",
    number_of_likes: 54354353,
    caption:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Vero dolore enim praesentium inventore asperiores sunt corporis unde dicta ipsa dolorum voluptatibus dolor, odio nobis est consequuntur labore!",
    id: 5,
  },
];

const SuggestionBox = () => {
  return (
    <>
      {/* Right Box */}
      <Show above="1000px">
        <Box
          width="xs"
          borderWidth="1px"
          borderColor="gray.400"
          borderRadius="lg"
          maxW="xl"
          paddingY="2"
          paddingX="2"
          marginY="4"
          height="50vh"
        >
          <Stack>
            <HStack>
              <Avatar src="https://bit.ly/dan-abramov" size="md" />
              <Box mx="2">
                <Text fontSize="md" fontWeight="bold">
                  username
                </Text>
                <Text fontSize="sm" color="GrayText">
                  name
                </Text>
              </Box>
              <Spacer />
              <Text color="blue.400" fontSize="xs" fontWeight="bold">
                Switch
              </Text>
            </HStack>
            <hr />
            <HStack>
              <Text color="gray.500" fontWeight="bold" fontSize="sm">
                Suggestion for you
              </Text>
              <Spacer />
              <Text fontSize="xs" fontWeight="bold">
                See All
              </Text>
            </HStack>

            {posts.map((val, idx) => {
              return (
                <div key={idx}>
                  <HStack>
                    <Avatar src="https://bit.ly/dan-abramov" size="sm" />
                    <Box>
                      <Text fontSize="sm" fontWeight="bold">
                        {val.username}
                      </Text>
                      <Text fontSize="xs" color="GrayText">
                        followed by {val.location} +7 more
                      </Text>
                    </Box>
                    <Spacer />
                    <Text
                      color="blue.400"
                      fontSize="xs"
                      fontWeight="bold"
                      paddingRight={4}
                    >
                      Follow
                    </Text>
                  </HStack>
                </div>
              );
            })}
          </Stack>
        </Box>
      </Show>
    </>
  );
};

export default SuggestionBox;
