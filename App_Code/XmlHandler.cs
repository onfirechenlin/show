using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Web;
using System.Xml;

/// <summary>
/// XmlHandler 的摘要说明
/// </summary>
public class XmlHandler
{
    /// <summary> 
    /// 功能:读取XML到DataSet中 
    /// </summary> 
    /// <param name="XmlPath">xml路径</param> 
    /// <returns>DataSet</returns> 
    public DataSet GetXml(string XmlPath)
    {
        DataSet ds = new DataSet();
        ds.ReadXml(@XmlPath);
        return ds;
    }

    /// <summary> 
    /// 读取xml文档并返回一个节点:适用于一级节点 
    /// </summary> 
    /// <param name="XmlPath">xml路径</param> 
    /// <param name="NodeName">节点</param> 
    /// <returns></returns> 
    public string ReadXmlReturnNode(string XmlPath, string Node)
    {
        XmlDocument docXml = new XmlDocument();
        docXml.Load(@XmlPath);
        XmlNodeList xn = docXml.GetElementsByTagName(Node);
        return xn.Item(0).InnerText.ToString();
    }

    /// <summary> 
    /// 更新Xml节点内容 
    /// </summary> 
    /// <param name="xmlPath">xml路径</param> 
    /// <param name="Node">要更换内容的节点:节点路径 根节点/父节点/当前节点</param> 
    /// <param name="Content">新的内容</param> 
    public void XmlNodeReplace(string xmlPath, string Node, string Content)
    {
        XmlDocument objXmlDoc = new XmlDocument();
        objXmlDoc.Load(xmlPath);
        objXmlDoc.SelectSingleNode(Node).InnerText = Content;
        objXmlDoc.Save(xmlPath);
    }
}