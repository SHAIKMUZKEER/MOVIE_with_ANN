import pandas as pd

# df = pd.read_csv("u.data",sep='\t', header=None, names=['user_id','movie_id','rating','timestamp'])
# print(df.head())
# df.to_csv("user_data.csv" , index = False)

# df = pd.read_csv("u.item" , sep = "|" , encoding = "latin -1" , header = None)
# data = df.iloc[: , :2]


# data.to_csv("movie_data.csv" , index = False , header= None)


##importing the movie_data to test the column is present or not 
# movie_data = pd.read_csv("movie_data.csv")
# print(movie_data.columns)


user_data = pd.read_csv("user_data.csv")
print(user_data.head())