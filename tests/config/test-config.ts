// Test configuration with environment-aware URLs
export const getApiBaseUrls = () => {
  // Check if running in Docker container
  const isDocker =
    process.env.CI === "true" || process.env.DOCKER_ENV === "true";

  return {
    STAIRS_API: isDocker
      ? "http://stairs_api:3001"
      : "http://localhost:3001",
  };
};

export const API_URLS = getApiBaseUrls();
