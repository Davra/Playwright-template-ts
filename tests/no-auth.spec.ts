/*
    By default, authentication is only handled once during global setup. After that,
    every test reuses that authentication state when instantiating a new Page or APIRequestContext.
    If you need to override this behaviour and create a Page or APIRequestContext that uses no 
    authentication, you can do so by using special fixtures - noAuthPage and appRequestNoAuth.
*/
import { test, expect } from "../fixtures";

test.describe.parallel("Test that doesn't use authenticated state", () => {
  test("Page instance will be go to the login page", async ({ noAuthPage }) => {
    const loginPage = noAuthPage.objects.loginPage;
    await loginPage.goto();
    await expect(noAuthPage).toHaveURL(/oauth\/authenticate$/);
  });

  test("API context without auth", async ({ appRequestNoAuth, appRequest }) => {
    // Get the storage state for the unauthenticated context
    const noAuthState = await appRequestNoAuth.storageState();
    // And for the authenticated context
    const authState = await appRequest.storageState();

    // Authenticated context starts with cookies
    expect(authState.cookies.length).not.toEqual(0);
    // Unauthenticated context starts without cookies
    expect(noAuthState.cookies.length).toEqual(0);

    const noAuthResponse = await appRequestNoAuth.get("/random-data");
    const authResponse = await appRequest.get("/random-data");

    expect(noAuthResponse.status()).toBe(401);
    expect(authResponse.status()).toBe(200);
  });
});
