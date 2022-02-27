import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AxiosResponse } from 'axios';
import auth from '../../apis/auth';
import getGapiAuthInstance from '../../apis/gapiAuth';
import { CurrentUser } from '../../interfaces';

const UpdateCurrentUserState = createAsyncThunk(
  'CurrentUser/UpdateCurrentUserState',
  async (_, thunkAPI) => {
    const gapiAuth = await getGapiAuthInstance();

    let response: AxiosResponse | null = null;
    response = await auth.post('/login', {
      userToken: gapiAuth.currentUser.get().getAuthResponse().id_token,
    });

    thunkAPI.dispatch(
      ChangeCurrentUser({
        ...response?.data,
      })
    );
  }
);

const initialState: CurrentUser | null = null as CurrentUser | null;

export const CurrentUserSlicer = createSlice({
  name: 'CurrentUser',
  initialState,
  reducers: {
    ChangeCurrentUser: (_state, action: PayloadAction<CurrentUser>) => {
      return { ...action.payload };
    },
  },
});
export { UpdateCurrentUserState };
export const { ChangeCurrentUser } = CurrentUserSlicer.actions;

export default CurrentUserSlicer.reducer;
