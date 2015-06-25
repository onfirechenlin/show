using System;
using System.Data;
using System.Configuration;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;
using System.Data.SqlClient;
using System.Data.OleDb;
using System.Security.Cryptography;
using System.IO;
using System.Text;
using System.Text.RegularExpressions;

/// <summary>
/// Class1 的摘要说明
/// </summary>
public class dbConn
{
    Funs df = new Funs();
    public SqlConnection dklConnectDo()  //链接数据库
    {
        AES aes = new AES();
        SqlConnection sqlConn;
        string strConn = ConfigurationManager.ConnectionStrings["conndb"].ToString();
        sqlConn = new SqlConnection(strConn);
        sqlConn.Open();
        return sqlConn;
    }
    public void CloseConn(SqlConnection sqlConn) //关闭数据库链接
    {
        if (sqlConn.State == ConnectionState.Open)
        {
            sqlConn.Close();
            sqlConn.Dispose();
        }
    }
    public void Execuse(string sqls)  //执行数据库链接,不返回记录集
    {
        SqlConnection conn = this.dklConnectDo();
        SqlCommand cmd = new SqlCommand();
        try
        {
            cmd.Connection = conn;
            cmd.CommandText = sqls;
            cmd.ExecuteNonQuery();
            conn.Close();
            conn.Dispose();
            cmd.Clone();
        }
        finally
        {
            if (conn != null && conn.State == ConnectionState.Open)
            {
                CloseConn(conn);
            }
            cmd.Clone();
        }
    }

    //n=1时,得到最新id
    //n=0时,得到受影响行数
    public int Execuse32(string sqls, int n)  //执行数据库链接,返回受影响行数
    {
        int AffRows = 0; //受影响行数
        SqlConnection conn = this.dklConnectDo();
        SqlCommand cmd = new SqlCommand();
        cmd.CommandType = CommandType.Text;
        cmd.Connection = conn;
        try
        {
            if (n == 1)
            {
                sqls = sqls + "SELECT SCOPE_IDENTITY() as 'bh';";
                cmd.CommandText = sqls;
                AffRows = Convert.ToInt32(cmd.ExecuteScalar()); //能得到最新id
            }
            else
            {
                cmd.CommandText = sqls;
                AffRows = Convert.ToInt32(cmd.ExecuteNonQuery()); //不能得到最新id,但返回受影响行数
            }
            CloseConn(conn);
            cmd.Clone();
            return AffRows;
        }
        finally
        {
            if (conn != null && conn.State == ConnectionState.Open)
                CloseConn(conn);
            cmd.Clone();
        }
    }


    public int Execuse_iCount(string sqls)  //执行数据库链接,返回记录数,一般用在判断是否有记录
    {
        SqlConnection conn = this.dklConnectDo();
        SqlDataAdapter dr = new SqlDataAdapter(sqls, conn);
        try
        {
            DataSet myds = new DataSet();
            dr.Fill(myds, "dr");
            int iCount = myds.Tables[0].Rows.Count;
            CloseConn(conn);
            dr.Dispose();
            return iCount;
        }
        finally
        {
            if (conn != null && conn.State == ConnectionState.Open)
            {
                CloseConn(conn);
            }
            dr.Dispose();

        }

    }
    public string Execuse_onlyone(string sqls)  //执行数据库链接,只返回第一个记录
    {
        SqlConnection conn = this.dklConnectDo();
        SqlCommand cmd = new SqlCommand(sqls, conn);
        SqlDataReader dr = cmd.ExecuteReader();

        try
        {
            string backstring = "";
            if (dr.Read())
                backstring = dr[0].ToString();
            else
                backstring = "";
            CloseConn(conn);
            dr.Dispose();

            return backstring;
        }
        finally
        {
            if (conn != null && conn.State == ConnectionState.Open)
            {
                CloseConn(conn);
            }
            dr.Dispose();
        }
    }

    #region sql参数化操作函数集

    //=====================================================================================//
    //         sql参数化操作函数集 By-刘俊研 Create:2014-06-12【2014-08-20第三次优化】       // 
    //=====================================================================================//
    // 调用示例：
    // sqls = "select * from member where uid = @uid and nickname=@nickname";
    // PExecuse32(conn,sqls,"@uid{!|!}值{!|!}数据库字段类型{!|!}字段长度","@nickname{!|!}值{!|!}数据库字段类型{!|!}字段长度");
    // 字段类型和长度在数据库中查看或者使用自动生成工具(int类型长度为NULL)
    public SqlDbType Get_SDT(string str)
    {
        switch (str.ToLower())
        {
            //如需要其他类型，请自行添加
            case "bit": return SqlDbType.Bit;
            case "text": return SqlDbType.Text;
            case "ntext": return SqlDbType.NText;
            case "int": return SqlDbType.Int;
            case "varchar": return SqlDbType.VarChar;
            case "nvarchar": return SqlDbType.NVarChar;
            case "nchar": return SqlDbType.NChar;
            case "smalldatetime": return SqlDbType.SmallDateTime;
            case "float": return SqlDbType.Float;
            case "datetime": return SqlDbType.DateTime;
            default: return SqlDbType.Int;           //表示出错！
        }
    }

    public void PExecuse(SqlConnection conn, string sqls, params string[] par)  //执行数据库链接,不返回记录集
    {
        string[] arr;
        SqlCommand cmd = new SqlCommand();
        try
        {
            cmd.Connection = conn;
            cmd.CommandText = sqls;
            foreach (string pars in par)
            {
                arr = Regex.Split(pars, @"\{\!\|\!\}", RegexOptions.IgnoreCase);
                cmd.Parameters.Add(new SqlParameter(arr[0], Get_SDT(arr[2]), int.Parse(arr[3])) { Value = arr[1] });
            }
            cmd.ExecuteNonQuery();
            conn.Close();
            conn.Dispose();
            cmd.Clone();
        }
        finally
        {
        }
    }

    //n=1时,得到最新id
    //n=0时,得到受影响行数
    public int PExecuse32(SqlConnection conn, string sqls, int n, params string[] par)  //执行数据库链接,返回受影响行数
    {
        int AffRows = 0; //受影响行数
        string[] arr;
        SqlCommand cmd = new SqlCommand();
        cmd.CommandType = CommandType.Text;
        cmd.Connection = conn;
        try
        {
            cmd.CommandText = sqls;
            foreach (string pars in par)
            {
                arr = Regex.Split(pars, @"\{\!\|\!\}", RegexOptions.IgnoreCase);
                if (df.xlength(arr[1]) > 0)
                {
                    cmd.Parameters.Add(new SqlParameter(arr[0], Get_SDT(arr[2]), int.Parse(arr[3])) { Value = arr[1] });
                }
                else
                {
                    //cmd.CommandText = cmd.CommandText.Replace("," + arr[0].Substring(1, arr[0].Length - 1) + "=" + arr[0], "");
                    cmd.CommandText = cmd.CommandText.Replace(arr[0], "''");
                    //df.WriteLog(cmd.CommandText);
                }
            }
            if (n == 1)
            {
                //cmd.CommandText = cmd.CommandText + ";select @@identity;";
                cmd.CommandText = cmd.CommandText + " SELECT SCOPE_IDENTITY();";
                AffRows = Convert.ToInt32(cmd.ExecuteScalar()); //能得到最新id
            }
            else
            {
                AffRows = Convert.ToInt32(cmd.ExecuteNonQuery()); //不能得到最新id,但返回受影响行数
            }
            cmd.Clone();
            return AffRows;
        }
        finally
        {
        }
    }

    public string PExecuse_onlyone(SqlConnection conn, string sqls, params string[] par)  //执行数据库链接,只返回第一个记录
    {
        string[] arr;
        SqlCommand cmd = new SqlCommand();
        cmd.CommandText = sqls;
        cmd.Connection = conn;
        foreach (string pars in par)
        {
            arr = Regex.Split(pars, @"\{\!\|\!\}", RegexOptions.IgnoreCase);
            cmd.Parameters.Add(new SqlParameter(arr[0], Get_SDT(arr[2]), int.Parse(arr[3])) { Value = arr[1] });
        }
        SqlDataReader dr = cmd.ExecuteReader();

        try
        {
            string backstring = "";
            if (dr.Read())
                backstring = dr[0].ToString();
            else
                backstring = "";
            dr.Dispose();

            return backstring;
        }
        finally
        {
        }
    }

    public int PExecuse_iCount(SqlConnection conn, string sqls, params string[] par)  //执行数据库链接,返回记录数,一般用在判断是否有记录
    {
        string[] arr;
        SqlDataAdapter dr5 = new SqlDataAdapter();
        SqlCommand cmd5 = new SqlCommand();
        try
        {
            cmd5.Connection = conn;
            cmd5.CommandText = sqls;
            foreach (string pars in par)
            {
                arr = Regex.Split(pars, @"\{\!\|\!\}", RegexOptions.IgnoreCase);
                cmd5.Parameters.Add(new SqlParameter(arr[0], Get_SDT(arr[2]), int.Parse(arr[3])) { Value = arr[1] });
            }
            dr5.SelectCommand = cmd5;

            DataSet myds = new DataSet();
            dr5.Fill(myds, "dr");
            int iCount = myds.Tables[0].Rows.Count;
            dr5.Dispose();
            return iCount;
        }
        finally
        {
        }
    }
    //=====================================================================================//
    //                          sql 参数化操作函数集 结束                                   // 
    //=====================================================================================//
    #endregion
}

